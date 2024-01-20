# Cognito

## Usage
1. Cognito 作成
```
terraform apply -target=module.cognito
```

2. コンソールからユーザ作成
3. パスワード変更

```
aws cognito-idp admin-set-user-password \
  --user-pool-id ap-northeast-1_HZPdrZHbz \
  --username test1 \
  --password 123456789tT! \
  --permanent
```

4. パスワードがlambda app 作成
```
terraform apply -target=module.lambda
```