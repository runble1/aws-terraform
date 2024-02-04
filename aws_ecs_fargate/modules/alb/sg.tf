####################################################
# Internet -> ALB
####################################################
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

####################################################
# ALB -> ECS
####################################################
resource "aws_security_group" "ecs" {
  name        = "${var.service}-ecs-sg"
  description = "${var.service}-ecs-sg"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.service}-ecs-sg"
  }
}

resource "aws_security_group_rule" "ecs_from_alb" {
  type      = "ingress"
  from_port = var.app_port
  to_port   = var.app_port
  #from_port = 0
  #to_port   = 0
  protocol = "tcp"

  source_security_group_id = aws_security_group.alb.id

  security_group_id = aws_security_group.ecs.id
}
