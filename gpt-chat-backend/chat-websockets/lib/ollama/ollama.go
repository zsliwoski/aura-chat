package ollama

import (
	"bytes"
	"encoding/json"
	"net/http"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

func PostChatMessage(url string, chatRequest ChatRequest) (*http.Response, error) {
	jsonData, err := json.Marshal(chatRequest)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}
