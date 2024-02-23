locals {
  service = "lambda_appsync"
}

module "dynamodb" {
  source       = "../../modules/dynamodb"
  product_name = "${var.env}-${local.service}"
}

module "appsync" {
  source       = "../../modules/appsync"
  product_name = "${var.env}-${local.service}"
  dynamodb_arn = module.dynamodb.dynamodb_arn
}

module "lambda" {
  source           = "../../modules/lambda"
  function_name    = "${var.env}-${local.service}"
  appsync_endpoint = module.appsync.appsync_endpoint
}
