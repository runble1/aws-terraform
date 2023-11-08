import axios from 'axios';
import { CVSSMetrics } from './cvssTypes';

export async function getCVEById(cveId: string): Promise<CVSSMetrics> {
  try {
    const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${cveId}`);
    const vulnerabilities = response.data?.vulnerabilities;

    // vulnerabilities配列が存在し、要素があるかどうかをチェック
    if (!vulnerabilities || vulnerabilities.length === 0) {
      throw new Error('Vulnerabilities data not found');
    }

    const cvssMetrics = vulnerabilities[0]?.cve?.metrics?.cvssMetricV31?.[0]?.cvssData;

    // cvssMetricsが見つかったかどうかをチェック
    if (!cvssMetrics) {
      throw new Error('CVSS metrics not found');
    }

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
  } catch (error) {
    console.error(error);
    throw error;
  }
}
