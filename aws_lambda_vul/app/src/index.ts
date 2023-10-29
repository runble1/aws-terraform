import axios from 'axios';

const SLACK_URL = "https://slack.com/api/chat.postMessage"
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

// Define enums for the possible values of each factor
enum Exposure {
  Public = 'public',
  Restricted = 'restricted'
}

enum ExploitCodeMaturity {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  None = 'none'
}

enum SystemMissionImpact {
  High = 'high',
  Medium = 'medium',
  Low = 'low'
}

enum SafetyImpact {
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
  exposure: Exposure;
  exploitCodeMaturity: ExploitCodeMaturity;
  systemMissionImpact: SystemMissionImpact;
  safetyImpact: SafetyImpact;
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
  // Map CVSS metrics to SSVC parameters
  const exposure = metrics.attackVector === 'NETWORK' ? Exposure.Public : Exposure.Restricted;
  const exploitCodeMaturity = metrics.attackComplexity === 'LOW' ? ExploitCodeMaturity.High : ExploitCodeMaturity.Low;
  const systemMissionImpact = metrics.confidentialityImpact === 'HIGH' || metrics.integrityImpact === 'HIGH' ? SystemMissionImpact.High : SystemMissionImpact.Low;
  const safetyImpact = metrics.availabilityImpact === 'HIGH' ? SafetyImpact.High : SafetyImpact.Low;

  return {
    exposure,
    exploitCodeMaturity,
    systemMissionImpact,
    safetyImpact
  };
}

function calculatePriority(params: SSVCParameters): string {
  // Assume a simplistic calculation for illustration
  const values = [
    params.exposure === Exposure.Public ? 2 : 0,
    params.exploitCodeMaturity === ExploitCodeMaturity.High ? 2 : 0,
    params.systemMissionImpact === SystemMissionImpact.High ? 2 : 0,
    params.safetyImpact === SafetyImpact.High ? 2 : 0
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
    Exposure: ${params.exposure}
    Exploit Code Maturity: ${params.exploitCodeMaturity}
    System Mission Impact: ${params.systemMissionImpact}
    Safety Impact: ${params.safetyImpact}
    Priority: ${priority}
  `;
}
