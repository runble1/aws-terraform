# ECS + Fargate

## Deploy
```
aws-vault exec test
docker compose up
docker compose run --rm terraform init
```

### 1. コンテナレジストリとコードリポジトリ作成
```
terraform apply -target=module.ecr
```

### 1.5 
#### アプリ
ECRへイメージプッシュ

#### Firelens
```
docker pull public.ecr.aws/aws-observability/aws-for-fluent-bit:latest
docker tag public.ecr.aws/aws-observability/aws-for-fluent-bit:latest ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/firelens
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.ap-northeast-1.amazonaws.com/firelens:latest
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
tagを最初だけ手打ち
```
terraform apply --target=module.ecs
```

### 6 ecspressoでデプロイ
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

### 7 Github Actions でデプロイ
- タスク定義が更新された場合（Terraform）
- アプリが更新された場合（Github Actions）

## 90 ECS Exec
```
aws ecs execute-command  \
    --cluster nextjs-ecs-cluster \
    --task <TASK_ID> \
    --container nextjs-container \
    --interactive \
    --command "/bin/sh"
```

## 99 Destroy
ECRのimageを削除
ECS Serviceを削除
terraform destroy


## Security Check
### Trivy
#### Dockerfile Scanning
開発
```
trivy config with-docker-compose-app/next-app/dev.Dockerfile
```
prod
```
trivy config with-docker-compose-app/next-app/prod.Dockerfile
```

#### Image Scanning
```
docker run -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy:0.47.0 image nextjs-app:latest
```
↓できない
```
trivy image --ignore-unfixed nextjs-app:latest
```

#### Secret Scanning
```
trivy fs ./
```

#### IoC Scanning
```
trivy config .
```