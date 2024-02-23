resource "aws_dynamodb_table" "product_prices" {
  name           = "ProductPrices"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5

  hash_key  = "ProductID"
  range_key = "CheckDate"

  attribute {
    name = "ProductID"
    type = "S"
  }

  attribute {
    name = "CheckDate"
    type = "S"
  }

  tags = {
    Purpose = "AmazonPriceTracking"
  }
}
