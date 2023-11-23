resource "aws_cloudfront_distribution" "this" {
  enabled = true

  # オリジン設定
  origin {
    domain_name = "minxvqeagjyfbnrtu3do72bglq0lnuio.lambda-url.ap-northeast-1.on.aws"
    #domain_name = var.function_url_domain
    origin_id = "lambdaFunctionURL"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # ビヘイビア設定
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "lambdaFunctionURL"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      #restriction_type = "whitelist"
      #locations        = ["US", "CA", "GB", "DE"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  # ログの設定（オプション）
  /*
  logging_config {
    include_cookies = false
    bucket          = "mylogs.s3.amazonaws.com"
    prefix          = "myprefix"
  }*/
}

resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "nextjs-origin-access-control"
  description                       = "Example Policy"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
