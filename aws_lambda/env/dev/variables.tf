variable "env" {
  description = "awsのprofile"
  default     = "dev"
}

variable "slack_workspace_id" {
  description = "slack workspace id"
}

variable "slack_channel_id" {
  description = "slack channel id"
}

variable "slack_bot_token" {
  description = "slack bot token"
}
variable "github_api_token" {
  description = "github api token"
}
