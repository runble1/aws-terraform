# Github Apps
CVE ID から CVSS スコアを取得し、SSVC で Priority を評価し、Slack へ通知する

## Overview
1. Slack Event Subscriptions で Vulnerability Alert を受け取り、Lambda へ通知
2. Lambda で CVE 番号から CVSSスコアを取得
3. CVSS スコアから SSVC で Priority を評価
4. 結果をスレッドへ返す

## API
### NVD
```
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-44228" | jq .
```

### EPSS
```
curl "https://api.first.org/data/v1/epss?cve=CVE-2021-44228" | jq .
```

### CISA KEV
```
https://www.cisa.gov/known-exploited-vulnerabilities-catalog
```

## Development
### envrc
vi .envrc
```
export SLACK_BOT_TOKEN=xxxx-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx
```

### Slack APP
https://api.slack.com/apps/A0637B2BQN6/general?

## Deploy
```
aws-vault exec test
terraform apply
```
