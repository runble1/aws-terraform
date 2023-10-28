import axios from 'axios';

const SLACK_URL = "https://slack.com/api/chat.postMessage"
//const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_BOT_TOKEN = 'xoxb-436747830610-6102930540630-1A2w0YUayox6V2q47x6oi9g6'

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
    await postMessageToThread(channel, messageText, thread_ts);

    const cveId = extractCVEId(messageText);
    if (cveId) {
      const cvssScore = await getCVEById(cveId);
      const ssvcParameters = mapCVSSScoreToSSVCParameters(cvssScore);
      const priority = calculatePriority(ssvcParameters);
      return respondWithPriority(priority);
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'Invalid request' }),
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

async function getCVEById(cveId: string): Promise<number> {
  try {
    const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);
    // Assuming CVSS score can be extracted from the response, adjust this as needed
    return response.data?.result?.cvss?.baseScore || 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

function mapCVSSScoreToSSVCParameters(cvssScore: number): SSVCParameters {
  // Map the CVSS score to SSVC parameters as needed
  // This is a placeholder implementation
  return {
    exposure: Exposure.Public,
    exploitCodeMaturity: ExploitCodeMaturity.High,
    systemMissionImpact: SystemMissionImpact.High,
    safetyImpact: SafetyImpact.High,
  };
}

function calculatePriority(params: SSVCParameters): string {
  const values = [
    params.exposure === Exposure.Public ? 1 : 0,
    mapEnumValueToScore(ExploitCodeMaturity, params.exploitCodeMaturity),
    mapEnumValueToScore(SystemMissionImpact, params.systemMissionImpact),
    mapEnumValueToScore(SafetyImpact, params.safetyImpact),
  ];
  const ssvcScore = values.reduce((a, b) => a + b, 0);
  return getPriority(ssvcScore);
}

function mapEnumValueToScore(enumObj: any, value: string): number {
  const keys = Object.keys(enumObj);
  return keys.indexOf(value);
}

function getPriority(ssvcScore: number): string {
  if (ssvcScore >= 8) return 'Critical';
  if (ssvcScore >= 5) return 'High';
  if (ssvcScore >= 3) return 'Medium';
  return 'Low';
}

function respondWithPriority(priority: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ priority }),
  };
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