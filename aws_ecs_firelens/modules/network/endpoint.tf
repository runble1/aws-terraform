########
# S3 (Dockerイメージの取得)
########
resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_endpoint_type = "Gateway"
  service_name      = "com.amazonaws.ap-northeast-1.s3"
  vpc_id            = aws_vpc.main.id

  route_table_ids = [
    aws_route_table.private_1a.id,
    aws_route_table.private_1c.id
  ]

  tags = {
    Environment = "${var.service}-s3endpoint"
  }
}

########
# ecr api (aws ecr get-login-password) 
########
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_1a.id,
    aws_subnet.private_1c.id
  ]

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-ecr.api.endpoint"
  }
}

########
# ecr dkr (docker image push)
########
resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${data.aws_region.self.name}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_1a.id,
    aws_subnet.private_1c.id
  ]

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-ecr.dkr.endpoint"
  }
}

########
# cloudwatch
########
resource "aws_vpc_endpoint" "logs" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-logs.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "logs_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.logs.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "logs_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.logs.id
  subnet_id       = aws_subnet.private_1c.id
}

########
# Secrets Manager
########
resource "aws_vpc_endpoint" "secretsmanager" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.secretsmanager"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-secretsmanager.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "secretsmanager_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.secretsmanager.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "secretsmanager_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.secretsmanager.id
  subnet_id       = aws_subnet.private_1c.id
}

########
# SSM for Parameter Store
########
resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.ssm"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-ssm.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "ssm_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.ssm.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "ssm_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.ssm.id
  subnet_id       = aws_subnet.private_1c.id
}

########
# ssmmessages for ECS Exec
########
resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.ssmmessages"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-ssmmessages.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "ssmmessages_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.ssmmessages.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "ssmmessages_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.ssmmessages.id
  subnet_id       = aws_subnet.private_1c.id
}

########
# Kinesis
########
resource "aws_vpc_endpoint" "kinesis" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.kinesis-firehose"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-kinesis.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "kinesis_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.kinesis.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "skinesis_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.kinesis.id
  subnet_id       = aws_subnet.private_1c.id
}

########
# KMS (Key Management Service)
########
resource "aws_vpc_endpoint" "kms" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.ap-northeast-1.kms"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  subnet_ids = [
    aws_subnet.private_1a.id,
    aws_subnet.private_1c.id
  ]

  security_group_ids = [
    aws_security_group.vpc_endpoint.id,
  ]

  tags = {
    Environment = "${var.service}-kms.endpoint"
  }
}

resource "aws_vpc_endpoint_subnet_association" "kms_private_1a" {
  vpc_endpoint_id = aws_vpc_endpoint.kms.id
  subnet_id       = aws_subnet.private_1a.id
}

resource "aws_vpc_endpoint_subnet_association" "kms_private_1c" {
  vpc_endpoint_id = aws_vpc_endpoint.kms.id
  subnet_id       = aws_subnet.private_1c.id
}
