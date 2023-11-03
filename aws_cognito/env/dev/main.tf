locals {
  service = "lambda_nextjs"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-${local.service}"
}

module "s3" {
  source = "../../modules/s3"

  bucket_name = "${var.env}-${local.service}"
}

module "lambda" {
  providers = {
    aws = aws.useast1
  }

  source                      = "../../modules/lambda"
  function_name               = "${var.env}-${local.service}"
  handler                     = "index.handler"
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  bucket_arn                  = module.s3.bucket_arn
  bucket_id                   = module.s3.bucket_id
}
