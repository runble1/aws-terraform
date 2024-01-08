# ====================
# Build and Prepare Layer Files
# ====================
resource "null_resource" "prepare_lambda_layer" {
  provisioner "local-exec" {
    command = <<EOT
      cd ../../app_layer
      rm -rf dist/
      npm install
      npm run build
      mkdir -p dist/nodejs
      cp -R node_modules dist/nodejs/
      cp dist/firehoseLoggerLayer.js dist/nodejs/
      rm dist/firehoseLoggerLayer.js
    EOT
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}

# ====================
# Archive
# ====================
data "archive_file" "layer_source" {
  depends_on = [null_resource.prepare_lambda_layer]

  type        = "zip"
  source_dir  = "../../app_layer/dist/"
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
