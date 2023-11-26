variable "env" {
  description = "awsのprofile"
  default     = "dev"
}

data "aws_caller_identity" "self" {}