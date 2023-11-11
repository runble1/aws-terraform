output "identity_pool_id" {
  value = module.cognito.identity_pool_id
}

output "user_pool_id" {
  value = module.cognito.user_pool_id
}

output "client_secret" {
  value = module.cognito.client_secret
  sensitive = true
}

output "cognito_user_pool_client_id" {
  value = module.cognito.cognito_user_pool_client_id
}


output "google_user_pool_id" {
  value = module.cognito_google.user_pool_id_google
}

output "google_client_secret" {
  value = module.cognito_google.client_secret_google
  sensitive = true
}

output "google_cognito_user_pool_client_id" {
  value = module.cognito_google.cognito_user_pool_client_id_google
}