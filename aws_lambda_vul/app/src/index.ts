
import axios from 'axios';

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

// Assume these values are obtained from your API
let exposure: Exposure = Exposure.Public;
let exploitCodeMaturity: ExploitCodeMaturity = ExploitCodeMaturity.High;
let systemMissionImpact: SystemMissionImpact = SystemMissionImpact.High;
let safetyImpact: SafetyImpact = SafetyImpact.High;

// SSVC Decision Tree Implementation
export async function evaluateSSVC(event: any): Promise<any> {

  console.log("koko");

  // Check for Slack challenge request
  if (event.body) {
    const body = JSON.parse(event.body);
    console.log(body);

    // If challenge parameter is found, return it as the response
    if (body.challenge) {
        return {
            statusCode: 200,
            body: JSON.stringify({ challenge: body.challenge }),
        };
    }
  }

  getCVEById('CVE-2019-1010218');

  // Evaluate Exposure
  let publicValue: number = exposure === Exposure.Public ? 1 : 0;

  // Evaluate Exploit Code Maturity
  let exploitValue: number;
  switch (exploitCodeMaturity) {
      case ExploitCodeMaturity.High:
          exploitValue = 3;
          break;
      case ExploitCodeMaturity.Medium:
          exploitValue = 2;
          break;
      case ExploitCodeMaturity.Low:
          exploitValue = 1;
          break;
      default:
          exploitValue = 0;
          break;
  }

  // Evaluate System Mission Impact
  let missionValue: number;
  switch (systemMissionImpact) {
      case SystemMissionImpact.High:
          missionValue = 3;
          break;
      case SystemMissionImpact.Medium:
          missionValue = 2;
          break;
      case SystemMissionImpact.Low:
          missionValue = 1;
          break;
      default:
          missionValue = 0;
          break;
  }

  // Evaluate Safety Impact
  let safetyValue: number;
  switch (safetyImpact) {
      case SafetyImpact.High:
          safetyValue = 3;
          break;
      case SafetyImpact.Medium:
          safetyValue = 2;
          break;
      case SafetyImpact.Low:
          safetyValue = 1;
          break;
      default:
          safetyValue = 0;
          break;
  }

  // Calculate SSVC Score
  let ssvcScore: number = publicValue + exploitValue + missionValue + safetyValue;

  // Determine Priority based on SSVC Score
  let priority: string;
  if (ssvcScore >= 8) {
      priority = 'Critical';
  } else if (ssvcScore >= 5) {
      priority = 'High';
  } else if (ssvcScore >= 3) {
      priority = 'Medium';
  } else {
      priority = 'Low';
  }

  // Execute SSVC Evaluation
  console.log('Priority:', priority);

  // Prepare the result
  const result = {
    priority,
  };

  // Return the result to AWS Lambda
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}


async function getCVEById(cveId: string) {
  try {
    const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

