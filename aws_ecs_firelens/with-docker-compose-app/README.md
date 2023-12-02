# Next.js with Docker Compose

## Overview
dev と prod の Docker compose がある。

## ローカル開発
### 起動
```
npm install
docker compose -f docker-compose.dev.yml up -d
```

### 確認
http://localhost:3000/
```
docker compose -f docker-compose.dev.yml ps
docker exec -it next-app sh
```

### 停止・再起動
```
docker compose -f docker-compose.dev.yml stop
docker compose -f docker-compose.dev.yml start
```

### シャットダウン
```
docker compose -f docker-compose.dev.yml down
```

## 手動デプロイ
### ECR認証
```
aws-vault exec test
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
export REPOSITORY_URL=${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs-ecs
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```

### 準備
```
export GIT_COMMIT_ID=$(git rev-parse HEAD)
```

### ビルド(prod)
```
cd next-app && npm install
cd ..
docker compose -f docker-compose.prod.yml build
docker images
```

### 確認
http://localhost:3000/api/healthcheck で 200 が返ってくればOK
```
docker compose -f docker-compose.prod.yml up -d --build
```

### イメージをECRへプッシュ
```
docker compose -f docker-compose.prod.yml push
```
