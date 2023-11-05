variable "function_name" {}
variable "handler" {}
variable "dynamodb_table_name" {}

data "aws_caller_identity" "self" {}