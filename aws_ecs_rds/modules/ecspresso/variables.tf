variable "product" {}
variable "vpc_id" {}
variable "subnet_1a_id" {}
variable "subnet_1c_id" {}
variable "alb_target_group_arn" {}
variable "alb_sg_id" {}
variable "app_port" {}
variable "cluster_name" {}

variable "ecs_task_execution_role_arn" {}
variable "ecs_task_role_arn" {}
variable "ecs_sg_id" {}
variable "app_image_url" {}
variable "ecs_log_group_name" {}

data "aws_caller_identity" "self" {}