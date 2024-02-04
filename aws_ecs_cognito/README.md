# ECS + Fargate + Firelens
Cognitoレスポンス情報をS3へ保存

## Prepare 
```
aws-vault exec test
```

### 1 ECRにイメージ登録
#### アプリ
```
cd app
```
#### Firelens
```
cd firelens
```

### 2 Network
```
terraform apply -target=module.network
```

### 3 ALB
```
terraform apply --target=module.alb
```

### 4 CloudWatch
```
terraform apply --target=module.cloudwatch
```

### 5 ECS
```
terraform apply --target=module.ecs
```

### 6 ecspressoでデプロイ
* デプロイ
```
terraform apply --target=module.ecspresso
or
ecspresso deploy --config ecspresso.yml
```
* リスト確認
```
terraform state list
terraform state show 
```

### 7 API requst
```
curl -X POST http://dev-cognito-alb-1791009463.ap-northeast-1.elb.amazonaws.com/authenticate -H "Content-Type: application/json" -d '{"username":"test1", "password":"123456789tT!"}'
```


## 90 ECS Exec
* 認証セット
```
aws-vault exec test
```
* Next.js
```
aws ecs execute-command  \
    --cluster dev-nextjs-ecs-cluster \
    --task fed6941fb1414ae5924820ab6d9c4eb4 \
    --container dev-nextjs-ecs-container \
    --interactive \
    --command "/bin/sh"
```
* Firelens
```
aws ecs execute-command  \
    --cluster dev-nextjs-ecs-cluster \
    --task fed6941fb1414ae5924820ab6d9c4eb4 \
    --container firelens-container \
    --interactive \
    --command "/bin/sh"
```

## 99 Destroy
```
terraform destroy
```
