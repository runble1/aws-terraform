locals {
  service           = "cognito" # ecspreso.ymlと同期する
  image_registry    = "${data.aws_caller_identity.self.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com"
  cognito_app_image = "${var.env}-ecs-cognito:latest"
  firelens_image    = "${var.env}-ecs-firelens:0.0.1"
}

module "s3" {
  source  = "../../modules/s3"
  product = "${var.env}-${local.service}"
}

module "network" {
  source            = "../../modules/network"
  env               = var.env
  service           = "${var.env}-${local.service}"
  s3_vpc_bucket_arn = module.s3.s3_vpc_bucket_arn
}

module "alb" {
  source              = "../../modules/alb"
  service             = "${var.env}-${local.service}"
  vpc_id              = module.network.vpc_id
  subnet_public_1a_id = module.network.subnet_public_1a_id
  subnet_public_1c_id = module.network.subnet_public_1c_id
  lb_port             = 80
  app_port            = 3000
  s3_alb_bucket_name  = module.s3.s3_alb_bucket_name
}

module "kms" {
  source  = "../../modules/kms"
  service = "${var.env}-${local.service}"
}

module "log" {
  source            = "../../modules/log"
  service           = "${var.env}-${local.service}"
  key_arn           = module.kms.key_arn
  s3_app_bucket_arn = module.s3.s3_app_bucket_arn
}

module "ecs" {
  source        = "../../modules/ecs"
  product       = "${var.env}-${local.service}"
  key_arn       = module.kms.key_arn
  ecr_image_url = "${local.image_registry}/${local.cognito_app_image}"
}

module "ecspresso" {
  depends_on                  = [module.ecs]
  source                      = "../../modules/ecspresso"
  product                     = "${var.env}-${local.service}"
  vpc_id                      = module.network.vpc_id
  subnet_1a_id                = module.network.subnet_private_1a_id
  subnet_1c_id                = module.network.subnet_private_1c_id
  alb_target_group_arn        = module.alb.target_group_arn
  alb_sg_id                   = module.alb.alb_sg_id
  ecs_sg_id                   = module.alb.ecs_sg_id
  app_port                    = 3000
  cluster_name                = module.ecs.ecs_cluster_name
  ecs_task_execution_role_arn = module.ecs.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.ecs.ecs_task_role_arn
  app_image_url               = "${local.image_registry}/${local.cognito_app_image}"
  firelens_image_url          = "${local.image_registry}/${local.firelens_image}"
  kinesis_firehose_name       = module.log.kinesis_firehose_name
}
