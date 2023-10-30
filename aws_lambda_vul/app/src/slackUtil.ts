import axios from 'axios';
import { CVSSMetrics } from './cvssTypes';
import { SSVCParameters } from './ssvcTypes';

const SLACK_URL = "https://slack.com/api/chat.postMessage";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export async function handleSlackRequests(headers: any, body: any): Promise<any> {
  const slackRetryResponse = await handleSlackRetry(headers);
  if (slackRetryResponse) return slackRetryResponse;

  const slackChallengeResponse = await handleSlackChallenge(body);
  if (slackChallengeResponse) return slackChallengeResponse;
  
  const slackEventResponse = await handleSlackEvent(body);
  if (slackEventResponse) return slackEventResponse;

  return null;
}

async function handleSlackRetry(headers: any): Promise<any> {
  if (headers['X-Slack-Retry-Num']) {
    console.info('X-Slack-Retry-Num: ' + headers['X-Slack-Retry-Num']);
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'ok' }),
    };
  }
  console.log("End Slack Retry")
  return null;
}

async function handleSlackChallenge(body: any): Promise<any> {
  // Slack Event Subscriptionの検証
  if (body?.challenge) {
    return {
      statusCode: 200,
      body: JSON.stringify({ challenge: body.challenge }),
    };
  }
  console.log("Fail Slack challenge")
  return null;
}

async function handleSlackEvent(body: any): Promise<any> {
  // 脆弱性Feedでなければ終了
  if (body?.event?.type !== 'message' && body.event.user === "U0630TCFWJJ") {
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'end' }),
    };
  }
  console.log("Fail Vul Feed")
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

export function formatResult(params: SSVCParameters, priority: string): string {
  return `
    Exploitation: ${params.exploitation}
    Exposure: ${params.exposure}
    Utility: ${params.utility}
    Human Impact: ${params.humanImpact}
    Priority: ${priority}
  `;
}