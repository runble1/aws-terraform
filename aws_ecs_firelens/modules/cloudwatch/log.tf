resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/firelens-logs"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "app_error" {
  name              = "/ecs/${var.service}-error-log"
  retention_in_days = 30
}