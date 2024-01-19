locals {
  service = "nextjs-login"
}

module "cognito" {
  source        = "../../modules/cognito"
  function_name = "${var.env}-${local.service}"
}

module "cognito_google" {
  source               = "../../modules/cognito_google"
  function_name        = "${var.env}-${local.service}"
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}

/*
module "dynamodb" {
  source       = "../../modules/dynamodb"
  service_name = "${var.env}-${local.service}"
}

module "lambda" {
  source              = "../../modules/lambda"
  function_name       = "${var.env}-${local.service}"
  handler             = "index.handler"
  dynamodb_table_name = module.dynamodb.table_name
}*/

/*
module "api_gateway" {
  source                    = "../../modules/api_gateway"
  function_name             = "${var.env}-${local.service}"
  write_function_invoke_arn = module.lambda.write_function_invoke_arn
  read_function_invoke_arn  = module.lambda.read_function_invoke_arn
  user_pool_arn             = module.cognito.user_pool_arn
}*/


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
