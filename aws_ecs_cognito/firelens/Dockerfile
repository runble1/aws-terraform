# ベースイメージの指定
FROM public.ecr.aws/aws-observability/aws-for-fluent-bit:init-arm64-2.32.0

# カスタムFluent Bit設定ファイルのコピー
COPY ./extra.conf /fluent-bit/etc/extra.conf
COPY ./parsers_json.conf /fluent-bit/etc/parsers_json.conf
