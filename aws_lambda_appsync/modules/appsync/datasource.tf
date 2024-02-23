resource "aws_appsync_datasource" "dynamodb_datasource" {
  api_id           = aws_appsync_graphql_api.this.id
  name             = "DynamoDBDataSource"
  type             = "AMAZON_DYNAMODB"
  service_role_arn = aws_iam_role.appsync_dynamodb_role.arn

  dynamodb_config {
    table_name = "YourDynamoDBTableName"
  }
}
