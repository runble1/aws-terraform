# イメージ保管用のS3バケット
resource "aws_s3_bucket" "default" {
  bucket = "${var.service}-${data.aws_caller_identity.self.account_id}"
}

resource "aws_s3_bucket_lifecycle_configuration" "default" {
  rule {
    id     = "${var.service}-lifecycle-rule"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 60
      storage_class = "GLACIER"
    }
  }

  bucket = aws_s3_bucket.default.id
}
