data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_firehose_policy" {
  name = "${var.function_name}-LambdaFirehosePolicy"

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
    ],
  })
}

resource "aws_iam_role_policy_attachment" "lambda_firehose_policy_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_firehose_policy.arn
}


resource "aws_iam_role" "lambda_role" {
  name               = "${var.function_name}-LambdaRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}
