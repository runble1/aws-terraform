# CloudFront + API Gateway + Lambda + Next.js

### 1. コンテナレジストリとコードリポジトリ作成

### 2 準備
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


