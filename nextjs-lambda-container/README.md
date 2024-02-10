# FIRELENS

## Deploy

### standaloneを作成
```
cd app-nextjs
npm install
npm run build
```
* 確認
```
npm run start
```

### ECR認証
```
aws-vault exec test
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```

### ビルド
* ビルド
```
docker buildx build --platform linux/arm64 -t lambda-nextjs-app:0.0.1 .
```
* 実行
```
docker run -d --name my-running-container lambda-nextjs-app:0.0.1
```
* ログイン
```
docker exec -it my-running-container /bin/bash
```

### プッシュ
```
docker tag firelens:0.0.1 ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-lambda-nextjs-app:0.0.1
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-lambda-nextjs-app:0.0.1
```
