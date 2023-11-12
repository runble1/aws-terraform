resource "aws_cognito_user_pool" "this" {
  name = "${var.function_name}-user-pool"

  password_policy {
    minimum_length    = 8
    require_numbers   = true
    require_symbols   = true
    require_lowercase = true
    require_uppercase = true
  }
}


resource "aws_cognito_user_pool_client" "this" {
  name = "${var.function_name}--client"

  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED" # ユーザ存在エラーを防ぐ

  //read_attributes  = ["email", "custom:custom_attribute"]
  //write_attributes = ["email", "custom:custom_attribute"]
}