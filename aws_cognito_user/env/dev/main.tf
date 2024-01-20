locals {
  service = "user-auth"
}

module "cognito" {
  source        = "../../modules/cognito"
  function_name = "${var.env}-${local.service}"
}

module "lambda" {
  source                      = "../../modules/lambda"
  function_name               = "${var.env}-${local.service}"
  cognito_user_pool_id        = module.cognito.cognito_user_pool_id
  cognito_user_pool_client_id = module.cognito.cognito_user_pool_client_id
  cognito_client_secret       = module.cognito.cognito_client_secret
}
