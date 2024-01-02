# ====================
# Build
# ====================
resource "null_resource" "build_lambda_layer" {
  provisioner "local-exec" {
    command = "cd ../../app_layer && npm install && npm run build"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

# ====================
# Archive
# ====================
data "archive_file" "layer_source" {
  depends_on = [null_resource.build_lambda_layer]

  type        = "zip"
  source_dir  = "../../app_layer/dist"
  output_path = "../../archive/${var.function_name}_layer.zip"
}

# ====================
# Lambda Layer
# ====================
resource "aws_lambda_layer_version" "lambda_extension_layer" {
  layer_name = "${var.function_name}-layer"

  filename         = data.archive_file.layer_source.output_path
  source_code_hash = data.archive_file.layer_source.output_base64sha256

  compatible_runtimes = ["nodejs20.x"]
}
