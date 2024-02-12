variable "product" {}
variable "alb_dns_name" {}
variable "bucket_regional_domain_name" {}
variable "bucket_arn" {}
variable "bucket_id" {}
variable "alb_id" {}

data "aws_caller_identity" "self" {}