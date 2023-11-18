output "function_url" {
  value = aws_lambda_function_url.this.function_url
}

output "write_function_invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

output "lambda_function_qualified_arn" {
  value = aws_lambda_function.this.qualified_arn
}