resource "aws_ssm_parameter" "image_url" {
  name = "/${var.service}/image_url"
  type = "String"

  # ここを自動化したい
  value = "${var.image_url}${var.image_tag}"

  # value が変更されても Terraform で差分が発生しない
  #lifecycle {
  #  ignore_changes = [value]
  #}
}

data "aws_ssm_parameter" "image_url" {
  name = "/${var.service}/image_url"
  depends_on = [
    aws_ssm_parameter.image_url
  ]
}
