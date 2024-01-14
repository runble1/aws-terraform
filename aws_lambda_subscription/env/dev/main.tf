locals {
  service = "lambda-subscription-filter"
}

module "s3" {
  source  = "../../modules/s3"
  service = "${var.env}-${local.service}"
}

module "lambda_processor" {
  source        = "../../modules/lambda_processor"
  function_name = "${var.env}-${local.service}-processor"
}

module "kinesis" {
  source               = "../../modules/kinesis"
  service              = "${var.env}-${local.service}"
  lambda_processor_arn = module.lambda_processor.lambda_processor_arn
  s3_bucket_arn        = module.s3.s3_bucket_arn
}

module "cloudwatch" {
  source               = "../../modules/cloudwatch"
  function_name        = "${var.env}-${local.service}"
  service              = "${var.env}-${local.service}"
  log_group_name       = "/aws/lambda/${var.env}-${local.service}"
  kinesis_firehose_arn = module.kinesis.kinesis_firehose_arn
}

module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-${local.service}"
}
