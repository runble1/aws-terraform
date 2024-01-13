# ====================
# Build
# ====================
resource "null_resource" "build_lambda" {
  provisioner "local-exec" {
    command = <<EOT
      cd ../../app
      rm -rf dist/
      npm install
      npm run build
      cp -R node_modules dist/
    EOT
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
  source_dir  = "../../app/dist"
  output_path = "../../archive/${var.function_name}.zip"
}

# ====================
# Lambda
# ====================
resource "aws_lambda_function" "aws_alert_function" {
  function_name = var.function_name
  handler       = "index.handler"
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs20.x"
  timeout       = 10
  kms_key_arn   = aws_kms_key.lambda_key.arn #環境変数の暗号化

  filename         = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256

  layers = [var.lambda_layer_arn]

  logging_config {
    application_log_level = "INFO"
    log_format            = "JSON"
    log_group             = var.lambda_another_log_group
    system_log_level      = "WARN"
  }

  environment {
    variables = {
      KINESIS_FIREHOSE_NAME = var.kinesis_firehose_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy
  ]

  tags = {
    Name = "${var.function_name}"
  }
}

# ====================
# Functional URLs
# ====================
resource "aws_lambda_function_url" "aws_alert_function" {
  function_name      = aws_lambda_function.aws_alert_function.function_name
  authorization_type = "NONE"
}
