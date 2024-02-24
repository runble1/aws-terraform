resource "aws_appsync_graphql_api" "this" {
  name                = var.product_name
  authentication_type = "AWS_IAM"

  schema = <<EOF
type ProductPrice {
  ProductID: String!
  CheckDate: String!
  Price: Float
  PreviousPrice: Float
  PriceChange: Float
  Title: String
  URL: String
}

type Query {
  getProductPrice(ProductID: String!, CheckDate: String!): ProductPrice
}

type Mutation {
  putProductPrice(ProductID: String!, CheckDate: String!, Price: Float, PreviousPrice: Float, PriceChange: Float, Title: String, URL: String): ProductPrice
}

schema {
  query: Query
  mutation: Mutation
}
EOF

  log_config {
    cloudwatch_logs_role_arn = aws_iam_role.appsync_cwl_role.arn
    field_log_level          = "ERROR"
  }
}
