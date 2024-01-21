# タスクロール
# タスク内のアプリケーションがAWSリソースとやり取りするため
resource "aws_iam_role" "ecs_task_role" {
  name = "${var.product}-ecs-task-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "ecs_exec_additional_policy" {
  name        = "${var.product}-ecs-exec-policy"
  description = "Additional permissions required for ECS Exec"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:ExecuteCommand",
        "ecs:DescribeTasks"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ecs_exec_additional_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_exec_additional_policy.arn
}

resource "aws_iam_policy" "ecs_cloudwatch_logs_policy_for_task_role" {
  name        = "${var.product}-ecs-cloudwatch-logs-policy-for-task-role"
  description = "Allow ECS tasks to write logs to CloudWatch for task role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogStream",
          "logs:CreateLogGroup",
          "logs:PutLogEvents",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams"
        ],
        Resource = "*"
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_cloudwatch_logs_policy_for_task_role_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_cloudwatch_logs_policy_for_task_role.arn
}

resource "aws_iam_policy" "ecs_kms_policy_for_task_role" {
  name = "${var.product}-ecs-kms-policy-for-task-role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ],
        Resource = "*"
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_kms_policy_for_task_role_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_kms_policy_for_task_role.arn
}

resource "aws_iam_policy" "ecs_kinesis_policy" {
  name        = "${var.product}-ecs-kinesis-policy-for-task-role"
  description = "Allow ECS tasks to write logs to CloudWatch for task role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "firehose:PutRecordBatch",
        ],
        Resource = "*"
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "ecs_kinesis_policy_for_task_role_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_kinesis_policy.arn
}


# ToDo:あとで消す
resource "aws_iam_role_policy_attachment" "ecs_tas_test" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
