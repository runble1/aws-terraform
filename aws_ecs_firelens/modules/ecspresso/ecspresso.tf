resource "null_resource" "ecspresso" {
  triggers = {
    cluster            = var.cluster_name,
    execution_role_arn = var.ecs_task_execution_role_arn,
  }

  provisioner "local-exec" {
    command     = "ecspresso deploy"
    working_dir = "."
    environment = { // 環境変数で依存リソースの値(ecspressoで参照するもの)を渡す
      ECS_CLUSTER        = var.cluster_name,
      EXECUTION_ROLE_ARN = var.ecs_task_execution_role_arn,
      TASK_ROLE_ARN      = var.ecs_task_role_arn,
      SECURITY_GROUP_ID  = var.ecs_sg_id,
      SUBNET_1A_ID       = var.subnet_private_1a_id,
      SUBNET_1C_ID       = var.subnet_private_1c_id,
      TARGET_GROUP_ARN   = var.alb_target_group_arn,
      APP_IMAGE_URL      = var.app_image_url
      FIRELENS_IMAGE_URL = var.firelens_image_url
      APP_PORT           = var.app_port
      SERVICE_NAME       = "${var.service}"
      ECS_SERVICE_NAME   = "${var.service}-service"
      #SERVICE_NAME = "dev-nextjs-ecs-service"
      #CLUSTER_NAME = var.cluster_name
      CLUSTER_NAME          = "dev-nextjs-ecs-cluster"
      KINESIS_FIREHOSE_NAME = var.kinesis_firehose_name
    }
  }

  provisioner "local-exec" {
    command     = "ecspresso scale --tasks 0 && ecspresso delete --force"
    working_dir = "."
    when        = destroy // terraform destroy時に発動する条件
  }
}

data "aws_ecs_service" "oneshot" {
  cluster_arn  = var.cluster_name
  service_name = "${var.service}-service"
  depends_on = [
    null_resource.ecspresso,
  ]
}

# ECSサービスのタスク数を自動的にスケーリング
resource "aws_appautoscaling_target" "nginx" {
  max_capacity       = 10
  min_capacity       = 1
  resource_id        = "service/${var.cluster_name}/${data.aws_ecs_service.oneshot.service_name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}