locals {
  service = "lambda-subscription-filter"
}

module "lambda_processor" {
  source        = "../../modules/lambda_processor"
  function_name = "${var.env}-${local.service}-processor"
}

module "cloudwatch" {
  source               = "../../modules/cloudwatch"
  function_name        = "${var.env}-${local.service}"
  service              = "${var.env}-${local.service}"
  log_group_name       = "/aws/lambda/${var.env}-${local.service}"
  lambda_processor_arn = module.lambda_processor.lambda_processor_arn
}

module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-${local.service}"
}
