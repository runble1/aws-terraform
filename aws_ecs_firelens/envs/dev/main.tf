locals {
  service  = "ecs-nextjs"
  registry = "${data.aws_caller_identity.self.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com"
}

module "network" {
  source  = "../../modules/network"
  env     = var.env
  service = "${var.env}-${local.service}"
}

module "alb" {
  source              = "../../modules/alb"
  service             = "${var.env}-${local.service}"
  vpc_id              = module.network.vpc_id
  subnet_public_1a_id = module.network.subnet_public_1a_id
  subnet_public_1c_id = module.network.subnet_public_1c_id
  lb_port             = 80
  app_port            = 3000
}

module "kms" {
  source  = "../../modules/kms"
  service = "${var.env}-${local.service}"
}

module "log" {
  source  = "../../modules/log"
  service = "${var.env}-${local.service}"
  key_arn = module.kms.key_arn
}

module "ecs" {
  source    = "../../modules/ecs"
  service   = "${var.env}-${local.service}"
  key_arn   = module.kms.key_arn
  image_url = "${local.registry}/${var.env}-${local.service}-app"
  image_tag = "0.0.1"
}

module "ecspresso" {
  depends_on                  = [module.ecs]
  source                      = "../../modules/ecspresso"
  service                     = "${var.env}-${local.service}"
  vpc_id                      = module.network.vpc_id
  subnet_private_1a_id        = module.network.subnet_private_1a_id
  subnet_private_1c_id        = module.network.subnet_private_1c_id
  alb_target_group_arn        = module.alb.target_group_arn
  alb_sg_id                   = module.alb.alb_sg_id
  ecs_sg_id                   = module.alb.ecs_sg_id
  app_port                    = 3000
  cluster_name                = module.ecs.ecs_cluster_name
  ecs_task_execution_role_arn = module.ecs.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.ecs.ecs_task_role_arn
  app_image_url               = module.ecs.ecs_image_url
  firelens_image_url          = "${local.registry}/${var.env}-ecs-firelens:0.0.1"
  kinesis_firehose_name       = module.log.kinesis_firehose_name
}
