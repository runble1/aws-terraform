resource "aws_appsync_graphql_api" "example" {
  name                = "${var.puroduct_name}"
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
}
