locals {
  service = "cognito"
}

module "cognito" {
  source = "../../modules/cognito"
}

module "dynamodb" {
  source       = "../../modules/dynamodb"
  service_name = "${var.env}-${local.service}"
}

module "lambda" {
  source              = "../../modules/lambda"
  function_name       = "${var.env}-${local.service}"
  handler             = "index.handler"
  dynamodb_table_name = module.dynamodb.table_name
}

/*
module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-${local.service}"
}



module "s3" {
  source = "../../modules/s3"

  bucket_name = "${var.env}-${local.service}"
}*/
