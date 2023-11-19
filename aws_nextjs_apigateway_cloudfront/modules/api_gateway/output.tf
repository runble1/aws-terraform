output "endpoint_url" {
  value = "https://${aws_api_gateway_rest_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/${aws_api_gateway_stage.this.stage_name}/"
}

output "api_gateway_id" {
  value = aws_api_gateway_rest_api.this.id
}