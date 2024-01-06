# ====================
# Build and Prepare Layer Files
# ====================
resource "null_resource" "prepare_lambda_layer" {
  provisioner "local-exec" {
    command = <<EOT
      cd ../../app_layer
      npm install
      npm run build

      mkdir -p temp_layer/extensions
      mkdir -p temp_layer/nodejs-example-telemetry-api-extension/

      cp -R dist/* temp_layer/nodejs-example-telemetry-api-extension/
      cp package.json temp_layer/nodejs-example-telemetry-api-extension/
      cp -rf node_modules temp_layer/nodejs-example-telemetry-api-extension/

      #chmod +x temp_layer/nodejs-example-telemetry-api-extension/index.js

      cp extensions/nodejs-example-telemetry-api-extension temp_layer/extensions/
      chmod +x temp_layer/extensions/nodejs-example-telemetry-api-extension
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
  source_dir  = "../../app_layer/temp_layer"
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
