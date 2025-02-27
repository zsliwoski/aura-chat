# Build Golang websockets
FROM golang:1.23.6-bullseye as build

WORKDIR /app
COPY chat-websockets .
RUN go mod download

ARG GOFLAGS="'-ldflags=-w -s'"
ENV CGO_ENABLED=1

RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -buildmode=pie -o /bin/chat-websockets/server ./cmd/server/main.go
RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -trimpath -buildmode=pie -o /bin/chat-websockets/client ./cmd/client/main.go

# AI server image
FROM ollama/ollama:0.5.12
COPY --from=build /bin/chat-websockets /bin/chat-websockets
# Moving server files
COPY setup.sh /setup.sh
RUN chmod +x /setup.sh

EXPOSE 11434
ENTRYPOINT [ "/setup.sh" ]
