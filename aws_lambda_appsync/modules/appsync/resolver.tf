resource "aws_appsync_resolver" "getProductPrice_resolver" {
  api_id      = aws_appsync_graphql_api.this.id
  type        = "Query"
  field       = "getProductPrice"
  data_source = aws_appsync_datasource.dynamodb_datasource.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
    "ProductID": $util.dynamodb.toDynamoDBJson($ctx.args.ProductID),
    "CheckDate": $util.dynamodb.toDynamoDBJson($ctx.args.CheckDate)
  }
}
EOF

  response_template = <<EOF
$util.toJson($ctx.result)
EOF
  depends_on        = [aws_appsync_datasource.dynamodb_datasource]
}

resource "aws_appsync_resolver" "putProductPrice_resolver" {
  api_id      = aws_appsync_graphql_api.this.id
  type        = "Mutation"
  field       = "putProductPrice"
  data_source = aws_appsync_datasource.dynamodb_datasource.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "ProductID": { "S": "$ctx.args.ProductID" },
    "CheckDate": { "S": "$ctx.args.CheckDate" }
  },
  "attributeValues": {
    "Price": { "N": "$ctx.args.Price" },
    "PreviousPrice": { "N": "$ctx.args.PreviousPrice" },
    "PriceChange": { "N": "$ctx.args.PriceChange" },
    "Title": { "S": "$ctx.args.Title" },
    "URL": { "S": "$ctx.args.URL" }
  }
}
EOF

  response_template = <<EOF
$util.toJson($ctx.result)
EOF
  depends_on        = [aws_appsync_datasource.dynamodb_datasource]
}
