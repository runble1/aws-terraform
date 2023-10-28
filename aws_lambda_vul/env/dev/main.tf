locals {
  service = "vul_ssvc"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-github-app"
}

// Chatbot経由せずにLambdaで直接Slackに通知
module "lambda" {
  source        = "../../modules/lambda"
  function_name = "${var.env}-github-app"
  handler       = "index.evaluateSSVC"

  env = var.env

  slack_channel_id = var.slack_channel_id
  slack_bot_token  = var.slack_bot_token
  github_api_token = var.github_api_token
}
