locals {
  service = "lambda-extension-telemetry-api"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  service           = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-${local.service}"
}

module "lambda_layer" {
  source        = "../../modules/lambda_layer"
  function_name = "${var.env}-${local.service}"
}

module "lambda_function" {
  source           = "../../modules/lambda_function"
  function_name    = "${var.env}-${local.service}"
  lambda_layer_arn = module.lambda_layer.layer_arn
}
