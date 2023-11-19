# Lambda + API Gateway + Next.js

### 1. コンテナレジストリとコードリポジトリ作成
env/dev
```
terraform apply -target=module.ecr
```

### 2 準備
```
aws-vault exec test
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```
standaloneを作成
```
cd app-nextjs
npm install
npm run build
npm run start
```

### 3 Dockerイメージのビルド/プッシュ
ビルド
```
docker buildx build --platform linux/arm64 -t nextjs-app .
docker run -p 3000:3000 nextjs-app
```

プッシュ
```
docker tag nextjs-app:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs_cloudfront
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/nextjs_cloudfront:latest
```

### 2 lambda
```
terraform apply
```

## 100 Destroy
ECRのimageを手動で削除
terraform destroy


