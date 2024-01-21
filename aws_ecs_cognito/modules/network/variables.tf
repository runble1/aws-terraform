variable "env" {}
variable "service" {}
variable "s3_vpc_bucket_arn" {}

data "aws_region" "self" {}
data "aws_caller_identity" "self" {}
