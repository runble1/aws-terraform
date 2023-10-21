locals {
  service = "github_code_scannnig_alert"
}

module "cloudwatch" {
  source            = "../../modules/cloudwatch"
  function_name     = "${var.env}-${local.service}"
  log_group_name    = "/aws/lambda/${var.env}-${local.service}"
  metric_name       = "ErrorCount"
  metric_name_space = "${var.env}-github-app"
}

/*
module "chatbot" {
  depends_on         = [module.aws_cloudwatch]
  source             = "../../modules/chatbot"
  name               = "${var.env}-slackbot-error"
  aws_sns_topic_arn  = module.aws_cloudwatch.sns_topic_arn
  slack_workspace_id = var.slack_workspace_id
  slack_channel_id   = var.slack_channel_id
}*/

// Chatbot経由せずにLambdaで直接Slackに通知
module "lambda" {
  #depends_on        = [module.cloudwatch]
  source        = "../../modules/lambda"
  function_name = "${var.env}-github-app"

  env = var.env

  slack_channel_id = var.slack_channel_id
  slack_bot_token  = var.slack_bot_token
  github_api_token = var.github_api_token
}
