resource "github_repository" "example" {
  name        = "all_in_one"
  description = "My awesome codebase"

  visibility = "public"

  vulnerability_alerts   = true

  has_projects = true
}


resource "github_repository_dependabot_security_updates" "example" {
  repository  = github_repository.example.id
  enabled     = true
}

/*
resource "github_repository_project" "project" {
  name       = "terraform-project"
  repository = "${github_repository.example.name}"
  body       = "This is a repository project."
}
*/