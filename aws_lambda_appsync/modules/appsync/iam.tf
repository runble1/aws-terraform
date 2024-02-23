resource "aws_iam_role" "appsync_role" {
  name = "${var.product_name}-appsync-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "appsync.amazonaws.com"
      },
      Effect = "Allow",
    }]
  })
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
  role       = aws_iam_role.appsync_role.name
  policy_arn = aws_iam_policy.appsync_dynamodb_policy.arn
}

resource "aws_iam_role_policy_attachment" "appsync_dynamodb_access" {
  role       = aws_iam_role.appsync_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}
