locals {
  service = "nextjs-ecs"
}

module "network" {
  source  = "../../modules/network"
  env     = var.env
  service = "${var.env}-${local.service}"
}

module "alb" {
  source              = "../../modules/alb"
  env                 = var.env
  service             = "${var.env}-${local.service}"
  vpc_id              = module.network.vpc_id
  subnet_public_1a_id = module.network.subnet_public_1a_id
  subnet_public_1c_id = module.network.subnet_public_1c_id
  lb_port             = 80
  app_port            = 3000
}

module "cloudwatch" {
  source  = "../../modules/cloudwatch"
  service = "${var.env}-${local.service}"
}

module "ecs" {
  source               = "../../modules/ecs"
  service              = "${var.env}-${local.service}"
  vpc_id               = module.network.vpc_id
  alb_target_group_arn = module.alb.target_group_arn
  alb_sg_id            = module.alb.alb_sg_id
  app_port             = 3000
  # 下記はコンテナデプロイ時に更新したい？
  image_url = "${data.aws_caller_identity.self.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/${local.service}"
  image_tag = "9062c3be092426cc9701d2b55bc6b9481c9da1e4"
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
  app_port                    = 3000
  cluster_name                = module.ecs.ecs_cluster_name
  ecs_task_execution_role_arn = module.ecs.ecs_task_execution_role_arn
  ecs_task_role_arn           = module.ecs.ecs_task_role_arn
  ecs_sg_id                   = module.ecs.ecs_sg_id
  app_image_url               = module.ecs.ecs_image_url
  firelens_image_url          = "${data.aws_caller_identity.self.account_id}.dkr.ecr.ap-northeast-1.amazonaws.com/firelens:latest"
  kinesis_firehose_name       = module.ecs.kinesis_firehose_name
}
