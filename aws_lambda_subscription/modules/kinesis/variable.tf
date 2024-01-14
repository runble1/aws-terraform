variable "service" {}
variable "lambda_processor_arn" {}
variable "s3_bucket_arn" {}

data "aws_caller_identity" "self" {}