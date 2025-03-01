#!/bin/bash
echo "Starting Ollama server..."
ollama serve &

sleep 5

echo "Pulling Deepseek image..."
ollama pull "${INFERENCE_MODEL}"
ollama run "${INFERENCE_MODEL}" &

# start the chat server
echo "Starting chat server..."
/bin/chat-websockets