locals {
  service = "lambda_dynamodb"
}

module "dynamodb" {
  source = "../../modules/dynamodb"
}

module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-${local.service}"
}

module "appsync" {
  source        = "../../modules/appsync"
  puroduct_name = "${var.env}-${local.service}"
}