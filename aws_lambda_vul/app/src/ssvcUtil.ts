import { CVSSMetrics } from './cvssTypes';
import { Exploitation, Exposure, Utility, Automatable, ValueDensity, HumanImpact, SSVCParameters } from './ssvcTypes';
import { priorityMap, PriorityMapping } from './priorityMap';
import { SSVCEvaluation } from './SSVCEvaluation';

export function mapCVSSMetricsToSSVCParameters(metrics: CVSSMetrics): SSVCParameters {
    //
    const ssvcConfig = new SSVCEvaluation(Exposure.Controlled);
  
    // Map CVSS metrics to SSVC parameters
    const exploitation = Exploitation.None;
    const exposure = ssvcConfig.getExposure();
    const utility = calculateUtility(determineAutomatable(metrics), determineValueDensity(metrics));
    const humanImpact = ssvcConfig.getHumanImpact();
  
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
  
function calculateUtility(automatable: Automatable, valueDensity: ValueDensity): Utility {
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
