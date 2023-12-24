# ECS + Fargate

## Prepare 
```
aws-vault exec test
```

### 1
* アプリ
```
cd with-docker-compose-app
```
* Firelens
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

### 7 Github Actions でデプロイ
- タスク定義が更新された場合（Terraform）
- アプリが更新された場合（Github Actions）

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

## Security Check
### Trivy
#### Dockerfile Scanning
* 開発
```
trivy config with-docker-compose-app/next-app/dev.Dockerfile
```
* prod
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