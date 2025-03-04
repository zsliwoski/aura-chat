#!/bin/bash

# Build the Docker image for the backend:
echo Building Backend Docker Image...
cd ./gpt-chat-backend
docker build --progress=plain --no-cache -t gpt-chat-backend:latest .

# Run the Docker container for the backend:
echo Starting Backend Docker Container...
docker run -d -p 8080:8080 gpt-chat-backend:latest &

# Install frontend dependencies:
cd ..
echo Installing Frontend Dependencies...
cd ./gpt-chat-frontend
npm install

# Start the frontend server:
echo Starting Frontend Development Server...
npm run dev