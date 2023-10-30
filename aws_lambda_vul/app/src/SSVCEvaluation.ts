import { Exploitation, Exposure, Utility, HumanImpact } from './ssvcTypes';

export class SSVCEvaluation {
  private exploitation: Exploitation;
  private exposure: Exposure;
  private utility: Utility;
  private humanImpact: HumanImpact;

  constructor(exposure: Exposure) {
    this.exploitation = Exploitation.None;
    this.exposure = exposure;
    this.utility = Utility.Laborious;
    this.humanImpact = HumanImpact.Low;
  }
  
  getHumanImpact(): HumanImpact {
    return this.humanImpact;
  }
  
  getExposure(): Exposure {
    return this.exposure;
  }

  getExploitation(): Exploitation {
    return this.exploitation;
  }

  getUtility(): Utility {
    return this.utility;
  }

  setExploitation(exploitation: Exploitation) {
    this.exploitation = exploitation;
  }

  setExposure(exposure: Exposure) {
    this.exposure = exposure;
  }

  setUtility(utility: Utility) {
    this.utility = utility;
  }

  setHumanImpact(humanImpact: HumanImpact) {
    this.humanImpact = humanImpact;
  }
}
