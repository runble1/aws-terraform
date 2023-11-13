locals {
  service = "lambda_container_nextjs"
}

module "ecr" {
  source        = "../../modules/ecr"
  name          = local.service
  holding_count = 5
}

module "cloudwatch" {
  source  = "../../modules/cloudwatch"
  service = local.service
}

module "lambda" {
  source         = "../../modules/lambda"
  function_name  = local.service
  repository_url = module.ecr.repository_url
}

/*
module "network" {
  source  = "../../modules/network"
  env     = var.env
  service = local.service
}*/
