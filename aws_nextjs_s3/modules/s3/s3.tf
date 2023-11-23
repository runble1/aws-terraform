resource "aws_s3_bucket" "origin_contents" {
  bucket = var.bucket_name
}

resource "null_resource" "upload_to_s3" {
  provisioner "local-exec" {
    command = "aws s3 sync ../../app-nextjs/out s3://${var.bucket_name} --delete"
  }

  triggers = {
    always_run = "${timestamp()}"
  }
}
