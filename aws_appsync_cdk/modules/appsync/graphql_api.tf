resource "aws_appsync_graphql_api" "this" {
  name                = var.product_name
  authentication_type = "AWS_IAM"
  xray_enabled        = true

  schema = file("${path.module}/schema.graphql")

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync_cwl_role.arn
    field_log_level          = "ERROR"
    exclude_verbose_content  = false
  }
}
