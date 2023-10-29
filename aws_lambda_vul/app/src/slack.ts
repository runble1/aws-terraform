import axios from 'axios';
import { CVSSMetrics } from './cvssTypes';
import { SSVCParameters } from './ssvcTypes';

const SLACK_URL = "https://slack.com/api/chat.postMessage";
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

export function respondToChallenge(challenge: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({ challenge }),
  };
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