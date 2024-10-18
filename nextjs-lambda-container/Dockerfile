# Multi-stage buildでNext.jsをビルド
FROM public.ecr.aws/docker/library/node:23.0.0-slim as builder
WORKDIR /build
COPY . ./
RUN npm ci --verbose
RUN npm run build

# ベースイメージの変更
#FROM amazon/aws-lambda-nodejs:20.2024.02.07.18
FROM public.ecr.aws/docker/library/node:23.0.0-slim as runner

# Lambda Web Adapterのインストール
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1-aarch64 /lambda-adapter /opt/extensions/lambda-adapter

ENV PORT=3000 NODE_ENV=production
ENV AWS_LWA_ENABLE_COMPRESSION=true

COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/run.sh ./
RUN ln -s /tmp/cache ./.next/cache

CMD exec ./run.sh
#ENTRYPOINT ["node"]
#CMD ["server.js"]
