import { mapCVSSMetricsToSSVCParameters, calculatePriority } from './ssvcUtil'
import { getCVEById } from './cvssUtil'
import { respondToChallenge, postMessageToThread, formatCVSSMetrics, formatResult } from './slack'

export async function evaluateSSVC(event: any): Promise<any> {
  const body = event.body ? JSON.parse(event.body) : null;

  // Check for Slack challenge request
  if (body?.challenge) {
    return respondToChallenge(body.challenge);
  }

  // 脆弱性Feedでなければ終了
  if (body?.event?.type !== 'message' && body.event.user === "U0630TCFWJJ") {
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'end' }),
    };
  }

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

  return {
    statusCode: 200,
    body: JSON.stringify({ result: 'end' }),
  };
}

function extractCVEId(messageText: string): string | null {
  // Assuming CVE ID is the whole message text, adjust this as needed
  return messageText;
}
