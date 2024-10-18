terraform {
  required_version = ">= 1.3.8"
  required_providers {
    aws = "5.72.1"
  }
  backend "s3" {
    region  = "ap-northeast-1"
    bucket  = "runble1-tfstate"
    key     = "all_in_one/github/terraform.tfstate"
    encrypt = true
  }
}


# Configure the GitHub Provider
provider "github" {}
