# Github Apps
Github Code Scanning でアラートが Open になると Lambda へ通知され、Lambda から Slack へ通知

## Overview
1. Slack Event Subscriptions で Vulnerability Alert を受け取り、Lambda へ通知
2. Lambda で CVE 番号から CVSSスコアを取得
3. CVSS スコアから SSVC で Priority を計算
4. 結果をスレッドへ返す

## Development
### NVD API 
```
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2019-1010218" | jq .
```

### Slack APP
https://api.slack.com/apps/A0637B2BQN6/general?

## Deploy



### Slackへ

### Issue化
