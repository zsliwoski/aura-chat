#!/bin/bash
echo "Starting Ollama server..."
ollama serve &

sleep 5

echo "Pulling Deepseek image..."
ollama pull deepseek-r1:1.5b

echo "Starting Websocket server..."
go run websocket-server &
ollama run deepseek-r1:1.5b "tell me the basics of quantum mechanics"