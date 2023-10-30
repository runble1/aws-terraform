export enum Exploitation {
  Active = 'active',
  Poc = 'poc',
  None = 'none'
}
  
export enum Exposure {
  Open = 'open',
  Controlled = 'controlled',
  Small = 'small'
}
  
export enum Utility {
  SuperEffective = 'superEffective',
  Efficient = 'efficient',
  Laborious = 'laborious'
}
  
export enum Automatable {
  Yes = 'yes',
  No = 'no'
}
  
export enum ValueDensity {
  Diffuse = 'diffuse',
  Concentrated = 'concentrated'
}
  
export enum HumanImpact {
  VeryHigh = 'veryHigh',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

export enum SituatedSafetyImpact {
  None,
  Minor,
  Major,
  Hazardous,
  Catastrophic
}

export enum MissionImpact {
  None,
  Degraded,
  Crippled,
  MEF_Failure,
  Mission_Failure
}

export interface SSVCParameters {
  exploitation: Exploitation;
  exposure: Exposure;
  utility: Utility;
  humanImpact: HumanImpact;
}