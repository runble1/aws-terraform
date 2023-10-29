import { CVSSMetrics } from './cvssTypes';
import { Exploitation, Exposure, Utility, Automatable, ValueDensity, HumanImpact, SSVCParameters } from './ssvcTypes';
import { priorityMap, PriorityMapping } from './priorityMap';
import { SSVCEvaluation } from './SSVCEvaluation';

export function mapCVSSMetricsToSSVCParameters(metrics: CVSSMetrics): SSVCParameters {
  // 今回のターゲットの露出度
  const ssvcEvaluation = new SSVCEvaluation(Exposure.Controlled);
  
  // SSVC parameters 評価
  const exploitation = Exploitation.None;
  const exposure = ssvcEvaluation.getExposure();
  const utility = evaluateUtility(determineAutomatable(metrics), determineValueDensity(metrics));
  const humanImpact = evaluateHumanImpact(metrics);
  
  return {
    exploitation,
    exposure,
    utility,
    humanImpact
  };
}
  
function determineAutomatable(metrics: CVSSMetrics): Automatable {
  return metrics.attackComplexity === 'LOW' && metrics.userInteraction === 'NONE' ? Automatable.Yes : Automatable.No;
}
  
function determineValueDensity(metrics: CVSSMetrics): ValueDensity {
  return (metrics.confidentialityImpact === 'HIGH' || metrics.integrityImpact === 'HIGH' || metrics.availabilityImpact === 'HIGH')
    ? ValueDensity.Concentrated
    : ValueDensity.Diffuse;
}

function evaluateHumanImpact(metrics: CVSSMetrics): HumanImpact {
  const { confidentialityImpact, integrityImpact, availabilityImpact } = metrics;
  
  // CIAの最も高い影響を基にHumanImpactを判断します。
  const impacts = [confidentialityImpact, integrityImpact, availabilityImpact];
  const highestImpact = Math.max(...impacts.map(impact => impactEnumToNumber(impact)));

  switch (highestImpact) {
    case 3:  // HIGH
      return HumanImpact.VeryHigh;
    case 2:  // MEDIUM
      return HumanImpact.High;
    case 1:  // LOW
      return HumanImpact.Medium;
    default:  // NONE or unknown
      return HumanImpact.Low;
  }
}

function impactEnumToNumber(impact: string): number {
  switch (impact.toUpperCase()) {
    case 'HIGH':
      return 3;
    case 'MEDIUM':
      return 2;
    case 'LOW':
      return 1;
    default:  // NONE or unknown
      return 0;
  }
}

function evaluateUtility(automatable: Automatable, valueDensity: ValueDensity): Utility {
  if (automatable === Automatable.No && valueDensity === ValueDensity.Diffuse) {
    return Utility.Laborious;
  } else if (automatable === Automatable.No && valueDensity === ValueDensity.Concentrated) {
    return Utility.Efficient;
  } else if (automatable === Automatable.Yes && valueDensity === ValueDensity.Diffuse) {
    return Utility.Efficient;
  } else if (automatable === Automatable.Yes && valueDensity === ValueDensity.Concentrated) {
    return Utility.SuperEffective;
  } else {
    throw new Error('Invalid parameters for Automatable or Value Density');
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
