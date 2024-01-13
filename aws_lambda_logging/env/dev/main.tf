locals {
  service = "lambda-logging"
}

module "cloudwatch" {
  source         = "../../modules/cloudwatch"
  function_name  = "${var.env}-${local.service}"
  service        = "${var.env}-${local.service}"
  log_group_name = "/aws/lambda/${var.env}-${local.service}"
}

module "kinesis" {
  source                      = "../../modules/kinesis"
  service                     = "${var.env}-${local.service}"
  kinesis_firehose_log_group  = module.cloudwatch.kinesis_firehose_log_group
  kinesis_firehose_log_stream = module.cloudwatch.kinesis_firehose_log_stream
}

module "lambda_layer" {
  source        = "../../modules/lambda_layer"
  function_name = "${var.env}-${local.service}"
}

module "lambda" {
  source                   = "../../modules/lambda"
  function_name            = "${var.env}-${local.service}"
  lambda_layer_arn         = module.lambda_layer.layer_arn
  lambda_another_log_group = module.cloudwatch.lambda_another_log_group
  kinesis_firehose_name    = module.kinesis.kinesis_firehose_name
}
