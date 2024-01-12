resource "aws_kms_key" "lambda_key" {
  description              = "My Lambda Function Managed Key"
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  enable_key_rotation      = true
  deletion_window_in_days  = 7
  tags = {
    Name = "${var.function_name}-lambda"
  }
}
