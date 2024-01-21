module "nextjs" {
  source        = "../../modules/nextjs"
  name          = "dev-nextjs-ecs-app"
  holding_count = 1
}

module "firelens" {
  source        = "../../modules/firelens"
  name          = "dev-ecs-firelens"
  holding_count = 1
}

module "cognito" {
  source        = "../../modules/cognito"
  name          = "dev-ecs-cognito"
  holding_count = 1
}
