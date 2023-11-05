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
  output_path = "../../archive/${var.function_name}/code.zip"
}

# ====================
# Lambda
# ====================
resource "aws_lambda_function" "this" {
  function_name = var.function_name
  handler       = var.handler
  role          = aws_iam_role.lambda_role.arn
  runtime       = "nodejs18.x"
  timeout       = 30
  kms_key_arn   = aws_kms_key.lambda_key.arn #環境変数の暗号化

  filename         = data.archive_file.function_source.output_path
  source_code_hash = data.archive_file.function_source.output_base64sha256

  publish = true

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = var.dynamodb_table_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_policy
  ]
}

data "aws_lambda_function" "this_version" {
  function_name = aws_lambda_function.this.function_name
  qualifier     = aws_lambda_function.this.version # 特定のバージョンを指定
}

# ====================
# Test
# ====================
resource "null_resource" "test_lambda" {
  depends_on = [aws_lambda_function.this]

  provisioner "local-exec" {
    command = <<EOF
      aws lambda invoke \
        --function-name ${aws_lambda_function.this.function_name} \
        --cli-binary-format raw-in-base64-out \
        --payload '{"artist": "Michael Jackson", "title": "Thriller"}' \
        output.txt
EOF
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

# ====================
# Functional URLs
# ====================
resource "aws_lambda_function_url" "this" {
  function_name      = aws_lambda_function.this.function_name
  authorization_type = "NONE"
}
