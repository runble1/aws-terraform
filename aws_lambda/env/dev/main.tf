locals {
  service = "lambda-subscription-filter"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  service           = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-${local.service}"
}

module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-${local.service}"
}
