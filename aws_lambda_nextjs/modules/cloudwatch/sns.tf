resource "aws_sns_topic" "lambdas_errors" {
  name = "${var.function_name}-error-topic"
}
