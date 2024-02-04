resource "null_resource" "ecspresso" {
  triggers = {
    cluster            = var.ecs_cluster_name,
    execution_role_arn = var.ecs_task_execution_role_arn,
  }

  provisioner "local-exec" {
    command     = "ecspresso deploy"
    working_dir = "."
    environment = { // 環境変数で依存リソースの値(ecspressoで参照するもの)を渡す
      ECS_CLUSTER        = var.ecs_cluster_name,
      EXECUTION_ROLE_ARN = var.ecs_task_execution_role_arn,
      TASK_ROLE_ARN      = var.ecs_task_role_arn,
      SECURITY_GROUP_ID  = var.ecs_sg_id,
      SUBNET_1A_ID       = var.subnet_1a_id,
      SUBNET_1C_ID       = var.subnet_1a_id,
      TARGET_GROUP_ARN   = var.alb_target_group_arn,
      IMAGE_URL          = var.ecs_image_url
      APP_PORT           = var.app_port
      PRODUCT_NAME       = "${var.product}"
      ECS_SERVICE_NAME   = "${var.product}-service"
      ECS_LOG_GROUP_NAME = var.ecs_log_group_name
    }
  }

  provisioner "local-exec" {
    command     = "ecspresso scale --tasks 0 && ecspresso delete --force"
    working_dir = "."
    when        = destroy // terraform destroy時に発動する条件
  }
}

data "aws_ecs_service" "oneshot" {
  cluster_arn  = var.ecs_cluster_name
  service_name = "${var.product}-service"
  depends_on = [
    null_resource.ecspresso,
  ]
}

# ECSサービスのタスク数を自動的にスケーリング
resource "aws_appautoscaling_target" "nginx" {
  max_capacity       = 10
  min_capacity       = 1
  resource_id        = "service/${var.ecs_cluster_name}/${data.aws_ecs_service.oneshot.service_name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}