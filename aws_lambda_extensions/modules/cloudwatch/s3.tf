resource "aws_s3_bucket" "this" {
  bucket        = "${var.service}-app-access-log-${data.aws_caller_identity.self.account_id}"
  force_destroy = true
}
