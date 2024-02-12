output "ecs_log_group_name" {
  value = aws_cloudwatch_log_group.all_logs.name
}
