# Firelens System Logs
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/firelens-logs"
  retention_in_days = 30
}

# ECS Task が停止し場合に Slack 通知したい
resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/events/ECSStoppedTasksEvent"
  retention_in_days = 30
}

# ELB healthcheck
resource "aws_cloudwatch_log_group" "healthcheck" {
  name              = "/aws/ecs/firelens/healthcheck"
  retention_in_days = 30
}

# stderr
resource "aws_cloudwatch_log_group" "stderr" {
  name              = "/aws/ecs/firelens/stderr"
  retention_in_days = 30
}

# ECS Exec Command
resource "aws_cloudwatch_log_group" "ecs_exec_command" {
  name              = "/ecs/${var.service}-execute-command"
  retention_in_days = 30
  kms_key_id        = var.key_arn
}

resource "aws_cloudwatch_log_group" "all_logs" {
  name              = "/ecs/${var.service}-all-logs"
  retention_in_days = 30
  kms_key_id        = var.key_arn
}
