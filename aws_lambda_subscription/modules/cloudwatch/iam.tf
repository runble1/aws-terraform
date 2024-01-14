resource "aws_iam_role" "cloudwatch_to_firehose_role" {
  name = "${var.service}-CloudWatchToFirehoseRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "logs.ap-northeast-1.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_policy" "cloudwatch_to_firehose_policy" {
  name        = "CloudWatchToFirehosePolicy"
  description = "A policy that allows CloudWatch Logs to put data into a Kinesis Firehose stream"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "firehose:PutRecord",
          "firehose:PutRecordBatch"
        ],
        Effect   = "Allow",
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_to_firehose_attach" {
  role       = aws_iam_role.cloudwatch_to_firehose_role.name
  policy_arn = aws_iam_policy.cloudwatch_to_firehose_policy.arn
}

