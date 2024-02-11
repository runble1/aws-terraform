# CloudFront + API Gateway + Lambda Response Streaming + Next.js SSR + CodePipeline

### Deploy
* AWSリソース
```
terraform apply
```

* CodeをGithubにpushしたらビルドしてECRへコンテナイメージをデプロイ
* ECRへコンテナイメージがデプロイされたらCodePipelineが動いてLambdaへデプロイ

## 100 Destroy
ECRのimageを手動で削除
terraform destroy
