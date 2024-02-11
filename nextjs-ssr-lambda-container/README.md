# Next.js for Lambda

## Deploy

### 
* standaloneは作らない
```
npm install
```
* 確認
```
npm run start
```

### 準備
```
aws-vault exec test
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)
CONTAINER_NAME=lambda-nextjs-ssr-app
```
### ECR認証
```
aws ecr --region ap-northeast-1 get-login-password | docker login --username AWS --password-stdin https://${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/
```

### ビルド
* ビルド
```
docker buildx build --platform linux/arm64 -t ${CONTAINER_NAME}:0.0.1 .
```
* 実行
```
docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${CONTAINER_NAME}:0.0.1
```
* ログイン
```
docker exec -it ${CONTAINER_NAME} /bin/bash
```

### プッシュ
```
docker tag ${CONTAINER_NAME}:0.0.1 ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-${CONTAINER_NAME}:0.0.1
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/dev-${CONTAINER_NAME}:0.0.1
```
