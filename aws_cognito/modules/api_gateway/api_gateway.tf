// GET は OpenAPI 記法、POST は Terraform のリソースで定義する
resource "aws_api_gateway_rest_api" "this" {
  name = "${var.function_name}-api"

  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "api"
      version = "1.0"
    }
    securityDefinitions = {
      cognito_authorizer = {
        type                         = "apiKey",
        name                         = "Authorization",
        in                           = "header",
        x-amazon-apigateway-authtype = "cognito_user_pools",
        x-amazon-apigateway-authorizer = {
          type                         = "cognito_user_pools",
          providerARNs                 = [var.user_pool_arn],
          authorizerResultTtlInSeconds = 300
        }
      }
    },
    paths = {
      "/get-path" = {
        get = {
          security = [{ cognito_authorizer = [] }],
          x-amazon-apigateway-integration = {
            httpMethod           = "POST" # LambdaへのアクセスはPOST
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY" # Lambda Proxy 統合
            uri                  = "${var.read_function_invoke_arn}"
            credentials          = "${aws_iam_role.api_gateway_role.arn}"
          }
        }
      }
    }
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_resource" "post_resource" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "post-path"
}

resource "aws_api_gateway_method" "post_method" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.post_resource.id
  http_method = "POST"
  #authorization = "AWS_IAM"
  authorization = aws_api_gateway_authorizer.this.type
  authorizer_id = aws_api_gateway_authorizer.this.id
}

resource "aws_api_gateway_integration" "post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.post_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.write_function_invoke_arn
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.this.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "items"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.this.arn
    format = jsonencode({
      request_id         = "$context.requestId",
      ip                 = "$context.identity.sourceIp",
      user_agent         = "$context.identity.userAgent",
      request_time       = "$context.requestTime",
      http_method        = "$context.httpMethod",
      resource_path      = "$context.resourcePath",
      status             = "$context.status",
      response_latency   = "$context.responseLatency",
      integration_error  = "$context.integrationErrorMessage",
      integration_status = "$context.integrationStatus",
      api_id             = "$context.apiId",
      protocol           = "$context.protocol",
      response_length    = "$context.responseLength"
    })
  }
}

resource "aws_api_gateway_method_settings" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  stage_name  = aws_api_gateway_stage.this.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled    = true
    logging_level      = "INFO"
    data_trace_enabled = true
  }
}

resource "aws_api_gateway_authorizer" "this" {
  name          = "${var.function_name}-authorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  provider_arns = [var.user_pool_arn]
}

# ====================
# Test
# ====================
/*
resource "null_resource" "test_api_gateway" {
  # API Gatewayがデプロイされてからこのリソースを作成するように依存関係を設定
  depends_on = [aws_api_gateway_deployment.this]

  # local-execプロビジョナーを使用してAPI Gatewayエンドポイントを呼び出す
  provisioner "local-exec" {
    command = <<EOF
      # GETリクエストの例
      curl -X GET "https://${aws_api_gateway_rest_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/items/get-path?artist=Michael%20Jackson"
EOF
  }

  # このリソースが再作成されるためのトリガーを設定（オプショナル）
  triggers = {
    always_run = "${timestamp()}"
  }
}*/
