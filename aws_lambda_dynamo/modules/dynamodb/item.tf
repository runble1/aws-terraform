resource "aws_dynamodb_table_item" "product_price_item" {
  table_name = aws_dynamodb_table.product_prices.name
  hash_key   = "ProductID" # テーブルのハッシュキー属性名
  range_key  = "CheckDate" # テーブルのレンジキー属性名

  item = jsonencode({
    "ProductID" : { "S" : "EXAMPLE123" },
    "CheckDate" : { "S" : "2023-02-18" },
    "Price" : { "N" : "100" },
    "PreviousPrice" : { "N" : "95" },
    "PriceChange" : { "N" : "5" },
    "Title" : { "S" : "Example Product Title" },
    "URL" : { "S" : "https://www.amazon.com/dp/EXAMPLE123" }
  })
}
