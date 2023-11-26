output "ecs_cluster_name" {
  value = aws_ecs_cluster.cluster.name
}

output "ecs_task_execution_role_arn" {
  value = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_role_arn" {
  value = aws_iam_role.ecs_task_role.arn
}

output "ecs_sg_id" {
  value = aws_security_group.ecs.id
}

output "ecs_image_url" {
  value = aws_ssm_parameter.image_url.value
}