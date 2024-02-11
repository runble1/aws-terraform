resource "aws_cloudfront_distribution" "this" {
  enabled = true

  # オリジン設定
  origin {
    origin_id   = var.api_gateway_id
    domain_name = "${var.api_gateway_id}.execute-api.ap-northeast-1.amazonaws.com"
    origin_path = "/prod"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # ビヘイビア設定
  default_cache_behavior {
    target_origin_id = var.api_gateway_id

    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

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
