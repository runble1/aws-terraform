locals {
  service = "lambda_dynamodb"
}

/*
module "cloudwatch" {
  source  = "../../modules/cloudwatch"
  service = local.service
}
*/

module "dynamodb" {
  source  = "../../modules/dynamodb"
}

module "lambda" {
  source                = "../../modules/lambda"
  function_name         = "${var.env}-${local.service}"
}
