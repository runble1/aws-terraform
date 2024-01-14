resource "aws_kinesis_firehose_delivery_stream" "this" {
  name        = "${var.service}-log-stream"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = var.s3_bucket_arn

    buffering_size     = 5
    buffering_interval = 60
    compression_format = "GZIP"

    processing_configuration {
      enabled = "true"

      processors {
        type = "Lambda"

        parameters {
          parameter_name  = "LambdaArn"
          parameter_value = "${var.lambda_processor_arn}:$LATEST"
        }
      }
    }

    # CloudWatch エラーロギング設定を追加
    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.kinesis_log_group.name
      log_stream_name = "S3Delivery"
    }
  }
}
