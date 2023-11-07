import { mapCVSSMetricsToSSVCParameters, calculatePriority } from './ssvcUtil'
import { getCVEById } from './cvssUtil'
import { handleSlackRequests, postMessageToThread, formatCVSSMetrics, formatSSVC } from './slackUtil'

export async function evaluateSSVC(event: any): Promise<any> {
  const headers = event.headers || {};
  const body = event.body ? JSON.parse(event.body) : null;

  console.log("headers: " + JSON.stringify(headers));
  console.log("body: " + JSON.stringify(body));

  // リクエストのチェック
  const slackResponse = await handleSlackRequests(headers, body);
  if (!slackResponse) return {
    'statusCode': 200,
    'body': body.challenge
  };

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
    const resultMessage = formatSSVC(ssvcParameters, priority);
    await postMessageToThread(channel, resultMessage, thread_ts);

    // メンション
    if (cvssMetrics.baseScore >= 8 || 
      cvssMetrics.baseSeverity.toLowerCase() === 'critical' || 
      priority.toLowerCase() === 'out-of-cycle' || 
      priority.toLowerCase() === 'immediate') {
    const mentionMessage = "<!channel>";
    await postMessageToThread(channel, mentionMessage, thread_ts);
  }
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
