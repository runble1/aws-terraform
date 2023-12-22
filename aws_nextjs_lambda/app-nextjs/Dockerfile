# Multi-stage buildでNext.jsをビルド
FROM node:20 AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

# ベースイメージの変更
FROM amazon/aws-lambda-nodejs:20.2023.12.22.14

# Lambda Web Adapterのインストール
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=3000

COPY --from=builder /build/next.config.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./

ENTRYPOINT ["node"]
CMD ["server.js"]