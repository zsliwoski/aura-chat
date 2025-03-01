#!/bin/bash
echo "Starting Ollama server..."
ollama serve &

sleep 5

echo "Pulling Deepseek image..."
ollama pull "${INFERENCER_IMAGE}"
ollama run "${INFERENCER_IMAGE}" &

# start the chat server
echo "Starting chat server..."
/bin/chat-websockets &
