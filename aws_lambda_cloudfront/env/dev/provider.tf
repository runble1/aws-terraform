provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      Env    = "dev"
      System = "security"
    }
  }
}

// Lambda@edge用のプロバイダー
provider "aws" {
  alias  = "useast1"
  region = "us-east-1"
}


terraform {
  required_version = ">= 1.3.8"
  required_providers {
    aws = "5.34.0"
  }
  backend "s3" {
    region  = "ap-northeast-1"
    bucket  = "runble1-tfstate"
    key     = "all_in_one/aws_lambda_nextjs/terraform.tfstate"
    encrypt = true
  }
}
