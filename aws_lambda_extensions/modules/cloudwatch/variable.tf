variable "function_name" {}
variable "log_group_name" {}
variable "service" {}

variable "metric_name" {}
variable "metric_name_space" {}

data "aws_caller_identity" "self" {}