resource "aws_cognito_identity_pool" "this" {
  identity_pool_name               = "${var.function_name}-identity-pool"
  allow_unauthenticated_identities = true # 認証されていないアイデンティティを許可

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.this.id
    provider_name           = aws_cognito_user_pool.this.endpoint
    server_side_token_check = false
  }
}
