# Github Apps
CVE ID から CVSS スコアを取得し、SSVC で Priority を評価し、Slack へ通知する

## Overview
1. Slack Event Subscriptions で Vulnerability Alert を受け取り、Lambda へ通知
2. Lambda で CVE 番号から CVSSスコアを取得
3. CVSS スコアから SSVC で Priority を評価
4. 結果をスレッドへ返す

## Development
### NVD API 
```
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-44228" | jq .
```

### Slack APP
https://api.slack.com/apps/A0637B2BQN6/general?

## Deploy



### Slackへ

### Issue化
