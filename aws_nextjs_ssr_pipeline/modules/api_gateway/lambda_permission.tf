resource "aws_lambda_permission" "this" {
  statement_id  = "AllowExecutionFromAPIGatewaya"
  action        = "lambda:InvokeFunction"
  function_name = var.function_name
  principal     = "apigateway.amazonaws.com"
  #全ステージとメソッドを許可
  source_arn = "${aws_api_gateway_rest_api.this.execution_arn}/*/*/*"
}
