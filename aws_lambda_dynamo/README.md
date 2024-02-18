# Lambda + DynamoDB

## Deploy

### 1 コンテナレジストリ作成
```
aws-vault exec test
terraform apply -target=module.ecr
```

### 2 アプリのビルド
* standaloneを作成
```
cd app-nextjs
npm install
npm run build
```

* ローカル起動
```
npm run start
```

### 3 Dockerイメージのビルド
* ビルド
```
docker buildx build --platform linux/arm64 -t nextjs-app .
```

* ローカル起動
```
docker run -p 3000:3000 nextjs-app
```

### 4 イメージ登録
* ECR認証
```
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```

* プッシュ
```
docker tag nextjs-app:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/lambda_container_nextjs
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/lambda_container_nextjs:latest
```

### 4 lambda
```
terraform apply
```

## 100 Destroy
ECRのimageを手動で削除
terraform destroy
