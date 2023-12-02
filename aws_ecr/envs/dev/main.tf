module "nextjs" {
  source        = "../../modules/nextjs"
  name          = "nextjs-ecs"
  holding_count = 1
}

module "firelens" {
  source        = "../../modules/firelens"
  name          = "firelens"
  holding_count = 1
}

