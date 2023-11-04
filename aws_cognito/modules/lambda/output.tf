output "function_url" {
  value = aws_lambda_function_url.this.function_url
}

output "write_function_invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

output "read_function_invoke_arn" {
  value = aws_lambda_function.this2.invoke_arn
}