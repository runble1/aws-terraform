# イメージ保管用のS3バケット
resource "aws_s3_bucket" "vpc" {
  bucket        = "${var.product}-vpc-flowlogs-${data.aws_caller_identity.self.account_id}"
  force_destroy = true
}
