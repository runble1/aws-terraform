locals {
  service = "all_in_one"
}


resource "github_repository" "example" {
  name        = local.service
  description = "My awesome codebase"

  visibility = "public"

  # Depandabot
  vulnerability_alerts = true

  has_projects = true

  # Automatically delete head branches after pull requests are merged
  delete_branch_on_merge = true

  topics = ["dependabot"]
}

# dependabot 自動セキュリティ修正
resource "github_repository_dependabot_security_updates" "example" {
  repository = github_repository.example.id
  enabled    = true
}

/*できなかった
resource "github_repository_project" "project" {
  name       = "${local.service}-project"
  repository = "${github_repository.example.name}"
  body       = "This is a repository project."
}*/