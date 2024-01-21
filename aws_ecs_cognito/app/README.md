# DockerをLambdaへデプロイ

## Deploy
```
aws-vault exec test
terraform init
terraform apply
```

### 1. ECR作成

### 2 ECR認証
```
aws-vault exec test
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```

### 3 Dockerイメージのビルド
```
docker buildx build --platform linux/arm64 -t cognito-app .
```

### 4 イメージプッシュ
```
docker tag cognito-app:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-ecs-cognito
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-ecs-cognito:latest
```

### ローカルで確認
```
docker run -p 3000:3000 cognito-app
url -X POST http://localhost:3000/authenticate -H "Content-Type: application/json" -d '{"username":"test1", "password":"123456789tT!"}'
```