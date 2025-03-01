package main

import (
	"chat-websockets/lib/ollama"
	"chat-websockets/lib/utils"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all connections
	},
}

var ollamaURL = "http://" + utils.GetEnv("OLLAMA_HOST", "localhost:11434") + "/api/chat"
var inferenceModel = utils.GetEnv("INFERENCE_MODEL", "deepseek-r1:1.5b")

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade connection: %v", err)
		return
	}
	defer conn.Close()

	fmt.Println("Client connected")

	// Message handling loop
	for {
		// Read message
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading message: %v", err)
			break
		}

		// Print received message
		log.Printf("Received: %s", message)
		chatRequest := ollama.ChatRequest{
			Model:  inferenceModel,
			Stream: false,
			Messages: []ollama.Message{
				{
					Role:    "user",
					Content: string(message),
				},
			},
		}

		// Send message to LLM
		resp, err := ollama.PostChatMessage(ollamaURL, chatRequest)
		if err != nil {
			log.Printf("Error sending message to Ollama: %v", err)
			break
		}

		// Read the response JSON into an object
		var chatResponse ollama.ChatResponse
		err = json.NewDecoder(resp.Body).Decode(&chatResponse)
		if err != nil {
			log.Printf("Error decoding response: %v", err)
			break
		}
		defer resp.Body.Close()

		// Echo the message back
		responseBytes, err := json.Marshal(chatResponse)
		if err != nil {
			log.Printf("Error marshalling response: %v", err)
			break
		}

		log.Printf("Response: %s", responseBytes)

		err = conn.WriteMessage(messageType, responseBytes)
		if err != nil {
			log.Printf("Error writing message: %v", err)
			break
		}
	}

	fmt.Println("Client disconnected")
}

func main() {
	http.HandleFunc("/api/chat", handleWebSocket)

	port := ":" + utils.GetEnv("WEBSOCKET_PORT", "8080")
	fmt.Printf("WebSocket server starting on %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
