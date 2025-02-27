package main

import (
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

		// Echo the message back
		err = conn.WriteMessage(messageType, message)
		if err != nil {
			log.Printf("Error writing message: %v", err)
			break
		}
	}

	fmt.Println("Client disconnected")
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)

	// Serve a simple client for testing
	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "client.html")
	// })

	port := ":8080"
	fmt.Printf("WebSocket server starting on %s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
