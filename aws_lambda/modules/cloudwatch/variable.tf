variable "function_name" {}
variable "log_group_name" {}
variable "service" {}

variable "lambda_processor_arn" {}

data "aws_caller_identity" "self" {}