locals {
  service = "lambda-firehose"
}

module "cloudwatch" {
  source         = "../../modules/cloudwatch"
  function_name  = "${var.env}-${local.service}"
  service        = "${var.env}-${local.service}"
  log_group_name = "/aws/lambda/${var.env}-${local.service}"
}

module "kinesis_firehose" {
  source  = "../../modules/kinesis_firehose"
  service = "${var.env}-${local.service}"
}

module "lambda" {
  source                = "../../modules/lambda"
  function_name         = "${var.env}-${local.service}"
  kinesis_firehose_name = module.kinesis_firehose.kinesis_firehose_name
}
