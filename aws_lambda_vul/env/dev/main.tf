locals {
  service = "vul_ssvc"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-${local.service}"
}

// Chatbot経由せずにLambdaで直接Slackに通知
module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-${local.service}"
  handler       = "index.evaluateSSVC"

  env = var.env

  slack_bot_token  = var.slack_bot_token
}
