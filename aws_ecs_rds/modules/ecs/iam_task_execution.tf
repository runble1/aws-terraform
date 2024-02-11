# ECSタスク実行ロールの定義
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.product}-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# ECSタスクがIAMロールを引き受けるためのポリシードキュメント
data "aws_iam_policy_document" "assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ECSタスク実行ロールポリシーのアタッチメント
resource "aws_iam_role_policy_attachment" "amazon_ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Amazon ECRの読み取り専用アクセス権限のアタッチメント
resource "aws_iam_role_policy_attachment" "ecs_container_registry_read_only" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# CloudWatch Logsへの書き込み権限を持つカスタムIAMポリシー
resource "aws_iam_policy" "ecs_cloudwatch_logs_policy" {
  name        = "${var.product}-ecs-cloudwatch-logs-policy"
  description = "Allow ECS tasks to write logs to CloudWatch"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:CreateLogGroup"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

# カスタムCloudWatch Logsポリシーのアタッチメント
resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_logs_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_logs_policy.arn
}
