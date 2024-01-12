provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      Env    = "dev"
      System = "security"
    }
  }
}

terraform {
  required_version = ">= 1.3.8"
  required_providers {
    aws = "5.32.1"
  }
}
