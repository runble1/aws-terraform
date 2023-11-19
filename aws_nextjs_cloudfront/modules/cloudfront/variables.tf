variable "function_name" {}
variable "bucket_regional_domain_name" {}
variable "bucket_arn" {}
variable "bucket_id" {}
variable "lambda_qualified_arn" {}

data "aws_caller_identity" "self" {}