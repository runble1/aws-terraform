
# subsription filter -> firehose -> s3
resource "aws_iam_role" "firehose_role" {
  name = "firehose_to_s3_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = ["firehose.amazonaws.com", "logs.ap-northeast-1.amazonaws.com"]
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
          "*"
        ]
      },
      {
        Action = [
          "firehose:PutRecord",
          "firehose:PutRecordBatch"
        ],
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action = [
          "lambda:InvokeFunction",
          "lambda:GetFunctionConfiguration"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy" "cloudwatch_to_firehose_policy" {
  role = aws_iam_role.firehose_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
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

# ToDo:あとで消す
resource "aws_iam_role_policy_attachment" "ecs_tas_test" {
  role       = aws_iam_role.firehose_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}