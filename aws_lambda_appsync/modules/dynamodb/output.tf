output "dynamodb_arn" {
  value = aws_dynamodb_table.product_prices.arn
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.product_prices.name
}
