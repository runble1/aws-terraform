output "public_dns" {
  value = module.alb.public_dns
}

output "cloudwatch_logs_app_error" {
  value = module.log.cloudwatch_app_error_name
}

output "s3_app_access_log" {
  value = module.log.s3_app_access_log
}

output "kinesis_firehose_app_access_log" {
  value = module.log.kinesis_firehose_name
}
