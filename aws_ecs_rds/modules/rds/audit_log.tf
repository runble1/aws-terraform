resource "aws_db_option_group" "mysql_option_group" {
  name                     = "mysql-option-group"
  option_group_description = "Option group for enabling audit logging"

  engine_name          = "mysql"
  major_engine_version = "8.0"

  option {
    option_name = "MARIADB_AUDIT_PLUGIN"

    option_settings {
      name  = "SERVER_AUDIT_EVENTS"
      value = "CONNECT,QUERY"
    }
  }
}
