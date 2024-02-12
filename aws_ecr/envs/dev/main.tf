module "nextjs" {
  source        = "../../modules/nextjs"
  name          = "dev-ecs-nextjs-app"
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

module "lambda-nextjs-app" {
  source        = "../../modules/nextjs"
  name          = "dev-lambda-nextjs-app"
  holding_count = 1
}

module "lambda-nextjs-ssr-app" {
  source        = "../../modules/nextjs"
  name          = "dev-lambda-nextjs-ssr-app"
  holding_count = 1
}
