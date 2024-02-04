# ECS + Fargate

最小コスト、最小構成で

### 0
ECRへイメージプッシュ

### 1 S3
```
terraform apply -target=module.s3
```

### 2 Network
```
terraform apply -target=module.network
```

### 3 ALB
```
terraform apply --target=module.alb
```

### 4 KMS
```
terraform apply --target=module.kms
```

### 5 log
```
terraform apply --target=module.log
```

### 6 ECS
```
terraform apply --target=module.ecs
```

### 7 ecspressoでデプロイ
```
terraform apply --target=module.ecspresso
or
ecspresso deploy --config ecspresso.yml
```
※リスト確認
```
terraform state list
terraform state show 
```

## 90 ECS Exec
```
aws ecs execute-command  \
    --debug \
    --cluster dev-nextjs-ecs-cluster \
    --task cf57aca33cde4697a54ad8a7c0d17e6c \
    --container dev-nextjs-ecs-container \
    --interactive \
    --command "/bin/sh"
```
デバッグ
```
aws ecs describe-tasks --cluster dev-nextjs-ecs-cluster --tasks cf57aca33cde4697a54ad8a7c0d17e6c| grep enableExecuteCommand

```

## 99 Destroy
```
terraform destroy
```
