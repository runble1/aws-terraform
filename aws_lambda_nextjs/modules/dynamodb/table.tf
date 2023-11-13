resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "${var.service_name}-dynamodb-table"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "Artist"
  range_key      = "Title"

  attribute {
    name = "Artist"
    type = "S"
  }

  attribute {
    name = "Title"
    type = "S"
  }

  /*
  ttl {
    attribute_name = "TimeToExist"
    enabled        = false
  }*/

  /*
  global_secondary_index {
    name               = "TitleIndex"
    hash_key           = "Title"
    range_key          = "TopScore"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["UserId"]
  }*/

  tags = {
    Name        = "${var.service_name}-dynamodb-table"
    Environment = "production"
  }
}