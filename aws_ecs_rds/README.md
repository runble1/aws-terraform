# CloudFront + ALB + ECS + Fargate + RDS
Next.jsとRDSを連携させる、最小コスト

### 1 ECRにイメージ登録

### 2 デプロイ
```
aws-vault exec test
terraform apply
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

## 99 Destroy
```
terraform destroy
```
