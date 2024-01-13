variable "service" {}
variable "kinesis_firehose_log_group" {}
variable "kinesis_firehose_log_stream" {}
data "aws_caller_identity" "self" {}