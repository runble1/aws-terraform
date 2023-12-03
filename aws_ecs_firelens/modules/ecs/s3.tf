resource "aws_s3_bucket" "this" {
  bucket        = "${data.aws_caller_identity.self.account_id}-app-access-log"
  force_destroy = true
}
