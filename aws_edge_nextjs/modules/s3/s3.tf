resource "aws_s3_bucket" "origin_contents" {
  bucket = "${data.aws_caller_identity.self.account_id}-test-lambda-edge2"
}
