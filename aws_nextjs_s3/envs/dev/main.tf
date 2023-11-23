locals {
  service = "nextjs-s3"
}

module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${data.aws_caller_identity.self.account_id}-${var.env}-${local.service}-origin-contents"
}

module "cloudfront" {
  source                      = "../../modules/cloudfront"
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  bucket_arn                  = module.s3.bucket_arn
  bucket_id                   = module.s3.bucket_id
}
