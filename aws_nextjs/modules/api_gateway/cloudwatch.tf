resource "aws_cloudwatch_log_group" "this" {
  name = "/aws/api-gateway/${var.function_name}-api2"
}
