output "public_dns" {
  value = module.alb.public_dns
}

output "cloudwatch_app_error_name" {
  value = module.cloudwatch.cloudwatch_app_error_name
}

output "s3_app_access_log" {
  value = module.ecs.s3_app_access_log
}

output "kinesis_firehose_app_access_log" {
  value = module.ecs.kinesis_firehose_name
}
