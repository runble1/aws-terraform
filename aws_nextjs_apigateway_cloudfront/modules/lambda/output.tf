output "function_url" {
  value = aws_lambda_function_url.this.function_url
}

output "function_invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

output "lambda_function_qualified_arn" {
  value = aws_lambda_function.this.qualified_arn
}

output "function_name" {
  value = aws_lambda_function.this.function_name
}