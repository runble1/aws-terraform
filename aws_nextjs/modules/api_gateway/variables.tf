variable "function_name" {}
variable "write_function_invoke_arn" {}
variable "read_function_invoke_arn" {}
variable "user_pool_arn" {}

data "aws_caller_identity" "self" {}