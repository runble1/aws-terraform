import { CVSSMetrics } from './cvssTypes';
import { Exposure, Utility, Automatable, ValueDensity, HumanImpact, SituatedSafetyImpact, MissionImpact, SSVCParameters } from './ssvcTypes';
import { priorityMap, PriorityMapping } from './priorityMap';
import { SSVCEvaluation } from './SSVCEvaluation';
import { evaluateExploitation } from './ssvcUtilExploitation';

export async function mapCVSSMetricsToSSVCParameters(cveId: string, metrics: CVSSMetrics): Promise<SSVCParameters> {
  // 今回のターゲットの露出度
  const ssvcEvaluation = new SSVCEvaluation(Exposure.Small);
  
  // SSVC parameters 評価
  const exploitation = await evaluateExploitation(cveId);
  const exposure = ssvcEvaluation.getExposure();
  const utility = evaluateUtility(determineAutomatable(metrics), determineValueDensity(metrics));
  const humanImpact = evaluateHumanImpact(determineSituatedSafetyImpact(metrics), determineMissionImpact(metrics));
  
  return {
    exploitation,
    exposure,
    utility,
    humanImpact
  };
}

function evaluateUtility(automatable: Automatable, valueDensity: ValueDensity): Utility {
    switch (true) {  // `true`を使って各ケースを評価
      case automatable === Automatable.No && valueDensity === ValueDensity.Diffuse:
        return Utility.Laborious;
      case automatable === Automatable.No && valueDensity === ValueDensity.Concentrated:
        return Utility.Efficient;
      case automatable === Automatable.Yes && valueDensity === ValueDensity.Diffuse:
        return Utility.Efficient;
      case automatable === Automatable.Yes && valueDensity === ValueDensity.Concentrated:
        return Utility.SuperEffective;
      default:
        throw new Error('Invalid parameters for Automatable or Value Density');
      }
  }

function determineAutomatable(metrics: CVSSMetrics): Automatable {
  return metrics.attackComplexity === 'LOW' && metrics.userInteraction === 'NONE' ? Automatable.Yes : Automatable.No;
}

function determineValueDensity(metrics: CVSSMetrics): ValueDensity {
  return (metrics.confidentialityImpact === 'HIGH' || metrics.integrityImpact === 'HIGH' || metrics.availabilityImpact === 'HIGH')
    ? ValueDensity.Concentrated
    : ValueDensity.Diffuse;
}

function evaluateHumanImpact(situatedSafetyImpact: SituatedSafetyImpact, missionImpact: MissionImpact): HumanImpact {
  switch (true) {
    case (situatedSafetyImpact === SituatedSafetyImpact.None && missionImpact === MissionImpact.Mission_Failure):
    case (situatedSafetyImpact === SituatedSafetyImpact.Major && missionImpact === MissionImpact.Mission_Failure):
    case (situatedSafetyImpact === SituatedSafetyImpact.Hazardous):
    case (situatedSafetyImpact === SituatedSafetyImpact.Catastrophic):
      return HumanImpact.VeryHigh;
    case (situatedSafetyImpact === SituatedSafetyImpact.None && missionImpact === MissionImpact.MEF_Failure):
    case (situatedSafetyImpact === SituatedSafetyImpact.Major && missionImpact === MissionImpact.MEF_Failure):
    case (situatedSafetyImpact === SituatedSafetyImpact.Minor && (missionImpact === MissionImpact.MEF_Failure || missionImpact === MissionImpact.Crippled)):
      return HumanImpact.High;
    case (situatedSafetyImpact === SituatedSafetyImpact.None && (missionImpact === MissionImpact.None || missionImpact === MissionImpact.Degraded || missionImpact === MissionImpact.Crippled)):
    case (situatedSafetyImpact === SituatedSafetyImpact.Major && (missionImpact === MissionImpact.None || missionImpact === MissionImpact.Degraded || missionImpact === MissionImpact.Crippled)):
    case (situatedSafetyImpact === SituatedSafetyImpact.Minor && (missionImpact === MissionImpact.None || missionImpact === MissionImpact.Degraded)):
      return HumanImpact.Medium;
    default:
      throw new Error('Invalid combination of Situated Safety Impact and Mission Impact');
  }
}

function determineSituatedSafetyImpact(metrics: CVSSMetrics): SituatedSafetyImpact {
  // 機密性、完全性、または可用性のいずれかが高い場合、危険性は最も高いと評価する
  if (metrics.confidentialityImpact === 'HIGH' || metrics.integrityImpact === 'HIGH' || metrics.availabilityImpact === 'HIGH') {
    return SituatedSafetyImpact.Catastrophic;
  }
  // 機密性、完全性、または可用性のいずれかが中程度で、他のメトリクスが低いまたは中程度の場合、危険性は危険と評価する
  else if ((metrics.confidentialityImpact === 'MEDIUM' || metrics.integrityImpact === 'MEDIUM' || metrics.availabilityImpact === 'MEDIUM') &&
      (metrics.confidentialityImpact !== 'HIGH' && metrics.integrityImpact !== 'HIGH' && metrics.availabilityImpact !== 'HIGH')) {
    return SituatedSafetyImpact.Hazardous;
  }
  // 機密性、完全性、または可用性のいずれかが中程度で、他のメトリクスが低い場合、危険性は中程度と評価する
  else if ((metrics.confidentialityImpact === 'MEDIUM' || metrics.integrityImpact === 'MEDIUM' || metrics.availabilityImpact === 'MEDIUM') &&
      (metrics.confidentialityImpact === 'LOW' || metrics.integrityImpact === 'LOW' || metrics.availabilityImpact === 'LOW')) {
    return SituatedSafetyImpact.Major;
  }
  // いずれかのメトリクスが低く、他のメトリクスが中程度の場合、危険性は低いと評価する
  else if ((metrics.confidentialityImpact === 'LOW' || metrics.integrityImpact === 'LOW' || metrics.availabilityImpact === 'LOW') &&
      (metrics.confidentialityImpact === 'MEDIUM' || metrics.integrityImpact === 'MEDIUM' || metrics.availabilityImpact === 'MEDIUM')) {
    return SituatedSafetyImpact.Minor;
  }
  // すべてのメトリクスがLOWまたはNONEの場合、危険性は最も低いと評価する
  else if (
    (metrics.confidentialityImpact === 'LOW' || metrics.confidentialityImpact === 'NONE') &&
    (metrics.integrityImpact === 'LOW' || metrics.integrityImpact === 'NONE') &&
    (metrics.availabilityImpact === 'LOW' || metrics.availabilityImpact === 'NONE')
  ) {
    return SituatedSafetyImpact.None;
  }
  // それ以外の場合、危険性は不明であると評価する
  else {
    throw new Error('Unable to determine Situated Safety Impact');
  }
}

function determineMissionImpact(metrics: CVSSMetrics): MissionImpact {
  // 機密性、完全性、または可用性のいずれかが高い場合、ミッション影響は高いと評価する
  if (metrics.confidentialityImpact === 'HIGH' || metrics.integrityImpact === 'HIGH' || metrics.availabilityImpact === 'HIGH') {
    return MissionImpact.Mission_Failure;
  }
  // 機密性、完全性、または可用性のいずれかが中程度で、他のメトリクスが低い場合、ミッション影響は中程度と評価する
  else if ((metrics.confidentialityImpact === 'MEDIUM' || metrics.integrityImpact === 'MEDIUM' || metrics.availabilityImpact === 'MEDIUM') &&
      (metrics.confidentialityImpact !== 'HIGH' && metrics.integrityImpact !== 'HIGH' && metrics.availabilityImpact !== 'HIGH')) {
    return MissionImpact.Crippled;
  }
  // すべてのメトリクスが低い場合、ミッション影響は低いと評価する
  else if (metrics.confidentialityImpact === 'LOW' && metrics.integrityImpact === 'LOW' && metrics.availabilityImpact === 'LOW') {
    return MissionImpact.None;
  }
  // それ以外の場合、ミッション影響は低いと評価する
  else {
    return MissionImpact.Degraded;
  }
}

export function calculatePriority(params: SSVCParameters): string {
  // Convert enums to lowercase for map lookup
  const exploitation = params.exploitation;
  const exposure = params.exposure;
  const utility = params.utility;
  const humanImpact = params.humanImpact;
  
  // Look up priority based on provided parameters
  const typedPriorityMap = priorityMap as PriorityMapping;
  const priority = typedPriorityMap[exploitation]?.[exposure]?.[utility]?.[humanImpact];
    
  if (priority) {
    return priority;
  } else {
    throw new Error(`Invalid combination of parameters: ${exploitation}, ${exposure}, ${utility}, ${humanImpact}`);
  }
}
