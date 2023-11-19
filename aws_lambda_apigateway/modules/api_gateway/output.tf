output "endpoint_url" {
  value = "https://${aws_api_gateway_rest_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/${aws_api_gateway_stage.this.stage_name}/"
}

output "execution_arn" {
  value = aws_api_gateway_rest_api.this.execution_arn
}