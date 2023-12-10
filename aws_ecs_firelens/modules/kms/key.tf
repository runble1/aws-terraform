resource "aws_kms_key" "this" {
  description = "KMS key for ECS cluster"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.self.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Principal = {
          Service = ["ecs.amazonaws.com", "logs.amazonaws.com"]
        }
        Action = [
          "kms:Encrypt",
          "kms:Decrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:DescribeKey",
        ]
        Resource = "*"
      }
    ]
  })
}

# KMS Keyのエイリアスの作成（オプション）
resource "aws_kms_alias" "ecs_exec_command_key_alias" {
  name          = "alias/${var.service}-ecs-exec-command-key"
  target_key_id = aws_kms_key.this.key_id
}