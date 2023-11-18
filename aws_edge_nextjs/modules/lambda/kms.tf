resource "aws_kms_key" "lambda_key" {
  description             = "My Lambda Function Customer Master Key"
  enable_key_rotation     = true
  deletion_window_in_days = 7
  tags = {
    Name = "${var.function_name}-lambda"
  }
}

resource "aws_kms_alias" "lambda_key_alias" {
  name          = "alias/${var.function_name}2"
  target_key_id = aws_kms_key.lambda_key.id
}
