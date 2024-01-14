# ====================
# Build
# ====================
resource "null_resource" "build_lambda" {
  provisioner "local-exec" {
    command = "cd ../../app_processor && npm install && npm run build"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

# ====================
# Archive
# ====================
data "archive_file" "function_source" {
  depends_on = [null_resource.build_lambda]

  type        = "zip"
  source_dir  = "../../app_processor/dist"
  output_path = "../../archive_processor/${var.function_name}.zip"
}

# ====================
# Lambda
# ====================
resource "aws_lambda_function" "this" {
  function_name = var.function_name
  handler       = "index.handler"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs20.x"
  timeout       = 100

  filename         = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256

  logging_config {
    application_log_level = "INFO"
    log_format            = "JSON"
    #log_group             = var.lambda_another_log_group
    system_log_level      = "WARN"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy
  ]

  tags = {
    Name = "${var.function_name}-processor"
  }
}
