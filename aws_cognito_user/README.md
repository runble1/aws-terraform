# Cognito

## Usage
1. コンソールからユーザ作成
2. パスワード変更

```
aws cognito-idp admin-set-user-password \
  --user-pool-id ap-northeast-1_HZPdrZHbz \
  --username test1 \
  --password 123456789tT! \
  --permanent
```

