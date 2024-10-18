provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      Env    = "dev"
      System = "nextjs"
    }
  }
}

terraform {
  required_version = ">= 1.3.8"
  required_providers {
    aws = "5.72.1"
  }
  backend "s3" {
    region  = "ap-northeast-1"
    bucket  = "tfstate-runble1"
    key     = "aws/aws_ecr/terraform.tfstate"
    encrypt = true
  }
}
