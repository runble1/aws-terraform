variable "product" {}
variable "key_arn" {}
variable "ecr_image_url" {}

data "aws_caller_identity" "self" {}
