import axios from 'axios';
import { CVSSMetrics } from './cvssTypes';
import { SSVCParameters } from './ssvcTypes';

const SLACK_URL = "https://slack.com/api/chat.postMessage";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export async function handleSlackRequests(headers: any, body: any): Promise<any> {
  const slackRetryResponse = await handleSlackRetry(headers);
  if (!slackRetryResponse) return null;

  const slackChallengeResponse = await handleSlackChallenge(body);
  if (!slackChallengeResponse) return null;
  
  const slackEventResponse = await handleSlackEvent(body);
  if (!slackEventResponse) return null;

  return true;
}

async function handleSlackRetry(headers: any): Promise<any> {
  if (!headers['X-Slack-Retry-Num']) {
    return true //リトライでない場合は処理継続
  }
  console.log("Fail Slack Retry")
  return null;
}

async function handleSlackChallenge(body: any): Promise<any> {
  if (body?.challenge) {
    return true // challenge が成功した場合は処理継続
  } else if (!body?.challenge) {
    return true;  // challenge プロパティが存在しない場合は処理継続
  }
  console.log("Fail Slack challenge")
  return null;
}

async function handleSlackEvent(body: any): Promise<any> {
  // Slack Event が正常な場合は処理継続
  if (body?.event?.type === 'message' && body.event.user === "UCUSXHPHT") {
    return true; 
  }
  console.log("Fail Vul Feed");
  return null;
}

export async function postMessageToThread(channel: string, text: string, thread_ts: string): Promise<void> {
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
  
export function formatCVSSMetrics(metrics: CVSSMetrics): string {
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

export function formatSSVC(params: SSVCParameters, priority: string): string {
  return `
    Exploitation: ${params.exploitation}
    Exposure: ${params.exposure}
    Utility: ${params.utility}
    Human Impact: ${params.humanImpact}
    Priority: ${priority}
  `;
}