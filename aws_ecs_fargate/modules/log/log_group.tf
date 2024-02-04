# stderr
resource "aws_cloudwatch_log_group" "stderr" {
  name              = "/aws/ecs/firelens/stderr"
  retention_in_days = 30
}

# ECS Exec Command
resource "aws_cloudwatch_log_group" "ecs_exec_command" {
  name              = "/aws/ecs/${var.service}-execute-command"
  retention_in_days = 30
  kms_key_id        = var.key_arn
}

resource "aws_cloudwatch_log_group" "all_logs" {
  name              = "/aws/ecs/${var.service}-all-logs"
  retention_in_days = 30
}
