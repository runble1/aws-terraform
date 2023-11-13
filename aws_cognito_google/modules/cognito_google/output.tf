output "user_pool_id_google" {
  value = aws_cognito_user_pool.google.id
}

output "client_secret_google" {
  value = aws_cognito_user_pool_client.google.client_secret
}

output "cognito_user_pool_client_id_google" {
  value = aws_cognito_user_pool_client.google.id
}