variable "product" {}
variable "vpc_id" {}
variable "subnet_1a_id" {}
variable "subnet_1c_id" {}

data "aws_caller_identity" "self" {}