module "nextjs" {
  source        = "../../modules/nextjs"
  name          = "dev-nextjs-ecs-app"
  holding_count = 1
}

module "firelens" {
  source        = "../../modules/firelens"
  name          = "dev-nextjs-ecs-firelens"
  holding_count = 1
}

