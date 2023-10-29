import axios from 'axios';

const SLACK_URL = "https://slack.com/api/chat.postMessage"
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

enum Exploitation {
  Active = 'active',
  Poc = 'poc',
  None = 'none'
}

enum Exposure {
  Open = 'open',
  Controlled = 'controlled',
  Small = 'small'
}

enum Utility {
  SuperEffective = 'super effective',
  Efficient = 'efficient',
  Laborious = 'laborious'
}

enum Automatable {
  Yes = 'yes',
  No = 'no'
}

enum ValueDensity {
  Diffuse = 'diffuse',
  Concentrated = 'concentrated'
}

enum WellBeingMissionImpact {
  VeryHigh = 'very high',
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

interface CVSSMetrics {
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

interface SSVCParameters {
  exploitation: Exploitation;
  exposure: Exposure;
  utility: Utility;
  wellBeingMissionImpact: WellBeingMissionImpact;
}

// 対象システム由来の値
class SSVCConfig {
  private wellBeingMissionImpact: WellBeingMissionImpact;
  private exposure: Exposure;

  constructor(wellBeingMissionImpact: WellBeingMissionImpact, exposure: Exposure) {
    this.wellBeingMissionImpact = wellBeingMissionImpact;
    this.exposure = exposure;
  }

  getWellBeingMissionImpact(): WellBeingMissionImpact {
    return this.wellBeingMissionImpact;
  }

  getExposure(): Exposure {
    return this.exposure;
  }
}

export async function evaluateSSVC(event: any): Promise<any> {
  // Parse the event body
  const body = event.body ? JSON.parse(event.body) : null;

  // Check for Slack challenge request
  if (body?.challenge) {
    return respondToChallenge(body.challenge);
  }

  // Check for message event and process the CVE ID
  if (body?.event?.type === 'message' && body.event.user !== "U0630TCFWJJ") {
    const messageText = body.event.text;
    const channel = body.event.channel;
    const thread_ts = body.event.thread_ts || body.event.ts;

    const cveId = extractCVEId(messageText);
    if (cveId) {
      // CVSS
      const cvssMetrics = await getCVEById(cveId);
      const cvssMessage = formatCVSSMetrics(cvssMetrics);
      await postMessageToThread(channel, cvssMessage, thread_ts);
      // SSVC
      const ssvcParameters = mapCVSSMetricsToSSVCParameters(cvssMetrics);
      const priority = calculatePriority(ssvcParameters);
      const resultMessage = formatResult(ssvcParameters, priority);
      await postMessageToThread(channel, resultMessage, thread_ts);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result: 'end' }),
  };
}

function respondToChallenge(challenge: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ challenge }),
  };
}

function extractCVEId(messageText: string): string | null {
  // Assuming CVE ID is the whole message text, adjust this as needed
  return messageText;
}

async function getCVEById(cveId: string): Promise<CVSSMetrics> {
  try {
    const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);
    const cvssMetrics = response.data?.vulnerabilities[0]?.cve?.metrics?.cvssMetricV31[0]?.cvssData;
    if (cvssMetrics) {
      return {
        attackVector: cvssMetrics.attackVector,
        attackComplexity: cvssMetrics.attackComplexity,
        privilegesRequired: cvssMetrics.privilegesRequired,
        userInteraction: cvssMetrics.userInteraction,
        scope: cvssMetrics.scope,
        confidentialityImpact: cvssMetrics.confidentialityImpact,
        integrityImpact: cvssMetrics.integrityImpact,
        availabilityImpact: cvssMetrics.availabilityImpact,
        baseScore: cvssMetrics.baseScore,
        baseSeverity: cvssMetrics.baseSeverity
      };
    } else {
      throw new Error('CVSS metrics not found');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function mapCVSSMetricsToSSVCParameters(metrics: CVSSMetrics): SSVCParameters {
  //
  const ssvcConfig = new SSVCConfig(WellBeingMissionImpact.High, Exposure.Small);

  // Map CVSS metrics to SSVC parameters
  const exploitation = Exploitation.None;
  const exposure = ssvcConfig.getExposure();
  const utility = calculateUtility(determineAutomatable(metrics), determineValueDensity(metrics));
  const wellBeingMissionImpact = ssvcConfig.getWellBeingMissionImpact();

  return {
    exploitation,
    exposure,
    utility,
    wellBeingMissionImpact
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

function calculatePriority(params: SSVCParameters): string {
  const values = [
    params.exploitation === Exploitation.Active ? 2 : 0,
    params.exposure === Exposure.Open ? 2 : 0,
    params.utility === Utility.SuperEffective ? 2 : 0,
    params.wellBeingMissionImpact === WellBeingMissionImpact.VeryHigh ? 2 : 0,
  ];
  const ssvcScore = values.reduce((a, b) => a + b, 0);

  if (ssvcScore >= 6) return 'Critical';
  if (ssvcScore >= 4) return 'High';
  if (ssvcScore >= 2) return 'Medium';
  return 'Low';
}

async function postMessageToThread(channel: string, text: string, thread_ts: string): Promise<void> {
  const headers = {
    'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
  const data = {
    channel,
    text,
    thread_ts,
  };

  try {
    const response = await axios.post(SLACK_URL, data, { headers });
    if (!response.data.ok) {
      throw new Error(`Failed to post message: ${response.data.error}`);
    }
    console.log('Message posted successfully:', response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error posting message to Slack:', error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
  }
}

function formatCVSSMetrics(metrics: CVSSMetrics): string {
  return `
    Attack Vector: ${metrics.attackVector}
    Attack Complexity: ${metrics.attackComplexity}
    Privileges Required: ${metrics.privilegesRequired}
    User Interaction: ${metrics.userInteraction}
    Scope: ${metrics.scope}
    Confidentiality Impact: ${metrics.confidentialityImpact}
    Integrity Impact: ${metrics.integrityImpact}
    Availability Impact: ${metrics.availabilityImpact}
    Base Score: ${metrics.baseScore}
    Base Severity: ${metrics.baseSeverity}
  `;
}

function formatResult(params: SSVCParameters, priority: string): string {
  return `
    Exploitation: ${params.exploitation}
    Exposure: ${params.exposure}
    Utility: ${params.utility}
    Well Being Mission Impact: ${params.wellBeingMissionImpact}
    Priority: ${priority}
  `;
}
