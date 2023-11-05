output "identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}

output "user_pool_arn" {
  value = aws_cognito_user_pool.this.arn
}