# Firelens System Logs
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/firelens-logs"
  retention_in_days = 30
}

# Application Error Logs
resource "aws_cloudwatch_log_group" "app_error" {
  name              = "/ecs/${var.service}-error-log"
  retention_in_days = 30
}

# ECS Task が停止し場合に Slack 通知したい
resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/events/ECSStoppedTasksEvent"
  retention_in_days = 30
}
