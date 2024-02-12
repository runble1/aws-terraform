resource "aws_db_subnet_group" "this" {
  name       = var.product
  subnet_ids = [var.subnet_1a_id, var.subnet_1c_id]
}
