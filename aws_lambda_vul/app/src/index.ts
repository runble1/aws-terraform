import { mapCVSSMetricsToSSVCParameters, calculatePriority } from './ssvcUtil'
import { getCVEById } from './cvssUtil'
import { respondToChallenge, postMessageToThread, formatCVSSMetrics, formatResult } from './slack'

export async function evaluateSSVC(event: any): Promise<any> {
  const headers = event.headers || {};
  if (headers['X-Slack-Retry-Num']) {
    console.info('X-Slack-Retry-Num: ' + headers['X-Slack-Retry-Num']);
    // Slack EventAPI にレスポンスを返さないとリクエストが再送される
    return {
      statusCode: 200,
      body: JSON.stringify({ result: 'ok' }),
    };
  }

  const body = event.body ? JSON.parse(event.body) : null;
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
    const ssvcParameters = await mapCVSSMetricsToSSVCParameters(cveId, cvssMetrics);
    const priority = calculatePriority(ssvcParameters);
    console.log("priority: " + priority + "");
    const resultMessage = formatResult(ssvcParameters, priority);
    await postMessageToThread(channel, resultMessage, thread_ts);

    // メンション
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ result: 'end' }),
  };
}

function extractCVEId(messageText: string): string | null {
  // Regular expression to match CVE ID format
  const cveIdPattern = /CVE-\d{4}-\d+/i;
  const match = messageText.match(cveIdPattern);
  return match ? match[0] : null;
}