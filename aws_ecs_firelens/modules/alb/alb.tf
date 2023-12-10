# ====================
# ALB
# ====================
resource "aws_lb" "for_webserver" {
  name               = "${var.service}-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    var.subnet_public_1a_id,
    var.subnet_public_1c_id
  ]

  drop_invalid_header_fields = true

  access_logs {
    bucket = aws_s3_bucket.alb_logs.bucket
    #prefix  = "access_logs"
    enabled = true
  }

  tags = {
    Name = "${var.service}-ig"
  }
}

# ====================
# Target Group
# ====================
resource "aws_lb_target_group" "for_webserver" {
  name   = "${var.service}-tg"
  vpc_id = var.vpc_id

  port        = var.app_port
  protocol    = "HTTP"
  target_type = "ip"

  # コンテナへの死活監視設定
  health_check {
    path = "/api/healthcheck"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "${var.service}-tg"
  }
}

# ====================
# Listener
# ====================
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.for_webserver.arn
  port              = var.lb_port
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.for_webserver.arn
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ====================
# Security Group
# ====================
resource "aws_security_group" "alb" {
  name   = "${var.service}-alb-sg"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.service}-alb-sg"
  }
}

resource "aws_security_group_rule" "alb_http" {
  from_port         = var.lb_port
  to_port           = var.lb_port
  protocol          = "tcp"
  security_group_id = aws_security_group.alb.id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
}
