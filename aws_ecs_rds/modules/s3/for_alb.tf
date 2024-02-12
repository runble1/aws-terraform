resource "aws_s3_bucket" "alb" {
  bucket        = "${var.product}-alb-logs-${data.aws_caller_identity.self.account_id}"
  force_destroy = true
}

