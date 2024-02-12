# CloudFront + ALB + ECS + Fargate + RDS
* Next.jsとRDSを連携させる、最小コスト
* CloudFront経由でしかアクセスできない

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
* コンテナログイン
```
aws ecs execute-command  \
    --cluster dev-ecs-rds-cluster \
    --task ac703d14d38f40a6bd6e6b861f902e08 \
    --container dev-ecs-rds-container \
    --interactive \
    --command "/bin/sh"
```

* RDSログイン
```
mysql -h terraform-20240212014009866900000001.crnha6jswwvy.ap-northeast-1.rds.amazonaws.com -P 3306 -u foo -pfoobarbaz kenjadb
```

## 99 Destroy
```
terraform destroy
```
