#S3バケットポリシー（OACのみから許可する）
data "aws_iam_policy_document" "allow_access_from_cloudfront" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${var.bucket_arn}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.this.arn]
    }
  }
}

##バケットポリシーのアタッチ
resource "aws_s3_bucket_policy" "allow_access_from_cloudfront" {
  bucket = var.bucket_id
  policy = data.aws_iam_policy_document.allow_access_from_cloudfront.json
}