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

resource "aws_cognito_user_pool_domain" "this" {
  domain       = "${var.function_name}-domain"
  user_pool_id = aws_cognito_user_pool.this.id
}

// アプリクライント
resource "aws_cognito_user_pool_client" "this" {
  name = "${var.function_name}-client"
  user_pool_id = aws_cognito_user_pool.this.id

  callback_urls = ["https://localhost:3000/callback"]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]

  generate_secret = true

  explicit_auth_flows = [
    "ALLOW_CUSTOM_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH"
  ]

  prevent_user_existence_errors = "ENABLED" # ユーザ存在エラーを防ぐ

  //read_attributes  = ["email", "custom:custom_attribute"]
  //write_attributes = ["email", "custom:custom_attribute"]
}

resource "aws_cognito_identity_pool" "this" {
  identity_pool_name               = "${var.function_name}-identity-pool"
  allow_unauthenticated_identities = true # 認証されていないアイデンティティを許可

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = aws_cognito_user_pool.this.endpoint
    server_side_token_check = false
  }
}
