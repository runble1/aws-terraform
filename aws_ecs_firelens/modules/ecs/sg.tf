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
  protocol  = "tcp"

  #cidr_blocks = ["0.0.0.0/0"]
  source_security_group_id = var.alb_sg_id

  security_group_id = aws_security_group.ecs.id
}
