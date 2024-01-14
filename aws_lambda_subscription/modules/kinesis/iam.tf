resource "aws_iam_role" "firehose_role" {
  name = "${var.service}-FirehoseToS3Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = ["firehose.amazonaws.com"]
        },
      },
    ]
  })
}

resource "aws_iam_role_policy" "firehose_policy" {
  role = aws_iam_role.firehose_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:AbortMultipartUpload",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:PutObject"
        ],
        Effect = "Allow",
        Resource = [
          "${var.s3_bucket_arn}",
          "${var.s3_bucket_arn}/*"
        ]
      },
      {
        Action = [
          "lambda:InvokeFunction",
          "lambda:GetFunctionConfiguration"
        ],
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action = [
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "${aws_kinesis_firehose_delivery_stream.this.arn}"
      }
    ]
  })
}
