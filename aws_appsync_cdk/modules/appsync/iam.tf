data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["appsync.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# DynamoDB
resource "aws_iam_role" "appsync_dynamodb_role" {
  name               = "${var.product_name}-appsync-dynamodb-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "appsync_dynamodb_policy" {
  name        = "${var.product_name}-appsync-dynamodb-policy"
  description = "Allow AppSync to access DynamoDB tables"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      Effect   = "Allow",
      Resource = "${var.dynamodb_arn}"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "appsync_dynamodb_policy_attachment" {
  role       = aws_iam_role.appsync_dynamodb_role.name
  policy_arn = aws_iam_policy.appsync_dynamodb_policy.arn
}

# CloudWatch Logs
resource "aws_iam_role" "appsync_cwl_role" {
  name               = "${var.product_name}-appsync-cwl-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role_policy_attachment" "appsync_cwl_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppSyncPushToCloudWatchLogs"
  role       = aws_iam_role.appsync_cwl_role.name
}
