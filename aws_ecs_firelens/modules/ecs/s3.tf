resource "aws_s3_bucket" "this" {
  bucket = "${data.aws_caller_identity.self.account_id}-firelens"
}