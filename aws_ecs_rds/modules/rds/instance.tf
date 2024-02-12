resource "aws_db_instance" "this" {
  identifier = "${var.product}-rds"

  allocated_storage = 10
  db_name           = "kenjadb"

  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t4g.micro"

  username = "foo"
  password = "foobarbaz"

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  # Audit log
  #option_group_name = aws_db_option_group.mysql_option_group.name
  enabled_cloudwatch_logs_exports = ["slowquery", "error", "audit"]

  skip_final_snapshot = true
}
