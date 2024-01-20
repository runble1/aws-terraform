variable "service" {}
variable "key_arn" {}
variable "image_url" {}
variable "image_tag" {}

data "aws_caller_identity" "self" {}
