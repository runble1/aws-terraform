locals {
  product        = "lambda-nextjs"
  image_registry = "${data.aws_caller_identity.self.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com"
  app_image      = "${var.env}-lambda-nextjs-app:0.0.1"
}

module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${var.env}-${local.product}"
}

module "cloudwatch" {
  source  = "../../modules/cloudwatch"
  service = local.product
}

module "lambda" {
  source         = "../../modules/lambda"
  handler        = "index.handler"
  function_name  = "${var.env}-${local.product}"
  repository_url = "${local.image_registry}/${local.app_image}"
}

module "api_gateway" {
  source              = "../../modules/api_gateway"
  function_name       = module.lambda.function_name
  function_invoke_arn = module.lambda.function_invoke_arn
  depends_on          = [module.lambda]
}

module "cloudfront" {
  source                      = "../../modules/cloudfront"
  api_gateway_id              = module.api_gateway.api_gateway_id
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  bucket_arn                  = module.s3.bucket_arn
  bucket_id                   = module.s3.bucket_id
}
