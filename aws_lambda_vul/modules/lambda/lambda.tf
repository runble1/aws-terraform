variable "function_name" {}
variable "env" {}
variable "handler" {}

variable "slack_bot_token" {}

# ====================
# Build
# ====================
resource "null_resource" "build_lambda" {
  provisioner "local-exec" {
    command = "cd ../../app && npm install && npm run build && cp -r node_modules dist"
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
  output_path = "../../archive/aws_${var.env}/code.zip"
}

# ====================
# Lambda
# ====================
resource "aws_lambda_function" "aws_alert_function" {
  function_name = var.function_name
  handler       = var.handler
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs18.x"
  timeout       = 30
  kms_key_arn   = aws_kms_key.lambda_key.arn #環境変数の暗号化

  filename         = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256

  environment {
    variables = {
      SLACK_BOT_TOKEN  = var.slack_bot_token
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy
  ]
}


# ====================
# Functional URLs
# ====================
resource "aws_lambda_function_url" "aws_alert_function" {
  function_name      = aws_lambda_function.aws_alert_function.function_name
  authorization_type = "NONE"
}