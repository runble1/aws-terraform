output "get_endpoint_url" {
  value = "https://${aws_api_gateway_rest_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/items/get-path"
}

output "post_endpoint_url" {
  value = "https://${aws_api_gateway_rest_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/items/post-path"
}
