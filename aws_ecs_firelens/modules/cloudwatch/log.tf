resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.service}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/firelens-logs"
  retention_in_days = 30
}