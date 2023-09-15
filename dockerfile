FROM node:20-alpine3.17 as builder


ENV NODE_ENV=production
WORKDIR /src
RUN npm install
FROM gcr.io/distroless/nodejs20-debian11

COPY --from=builder /src /src

WORKDIR /src
EXPOSE 8080

CMD ["node", "server.js", "prod"]