resource "aws_lambda_function" "this" {
  function_name = var.function_name
  role          = aws_iam_role.lambda_role.arn

  package_type  = "Image"
  image_uri     = "${var.repository_url}:latest"
  architectures = ["arm64"]

  memory_size = 1024
  timeout     = 30

  kms_key_arn = aws_kms_key.lambda_key.arn #環境変数の暗号化
  environment {
    variables = {
      #DYNAMODB_TABLE_NAME = var.dynamodb_table_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy
  ]
}

# ====================
# Functional URLs
# ====================
resource "aws_lambda_function_url" "this" {
  function_name      = aws_lambda_function.this.function_name
  authorization_type = "NONE"
}
