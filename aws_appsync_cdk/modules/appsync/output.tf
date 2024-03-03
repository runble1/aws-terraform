output "appsync_endpoint" {
  value = aws_appsync_graphql_api.this.uris["GRAPHQL"]
}
