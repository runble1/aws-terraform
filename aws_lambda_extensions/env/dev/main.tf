locals {
  service = "lambda-extension-telemetry-api"
}

module "lambda_layer" {
  source        = "../../modules/lambda_layer"
  function_name = "${var.env}-${local.service}"
}

module "lambda_function" {
  source        = "../../modules/lambda_function"
  function_name = "${var.env}-${local.service}"
}
