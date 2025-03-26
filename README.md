# AuraChat

AuraChat is an AI-powered chatbot designed to facilitate seamless, intelligent conversations. By leveraging the latest advancements in machine learning and natural language processing, AuraChat delivers a highly responsive and engaging chat experience. 

## About

AuraChat is powered by the **DeepSeek-R1** large language model (LLM), which is responsible for text prediction and natural language generation. The platform is built using **Next.js** for the front-end and utilizes a **WebSocket server/client** implemented in **Go** for real-time, low-latency communication.

Whether you’re building a virtual assistant, customer support bot, or any other conversational AI tool, AuraChat provides the core infrastructure needed to get up and running quickly.

## Features

- **AI-powered**: Built on the DeepSeek-R1 LLM model for accurate, context-aware predictions.
- **Real-time communication**: WebSocket server/client for fast, seamless chat experiences.
- **Next.js front-end**: Highly responsive, modern user interface for a smooth user experience.
- **Open-source**: Contribute and help shape the future of AuraChat.

## Architecture

- **DeepSeek-R1 LLM**: Provides the language model responsible for generating responses and predictions.
- **Next.js**: A React framework for building the front-end UI of AuraChat.
- **Go WebSocket server**: Manages real-time messaging between the client and server, offering a scalable solution for chat applications.

## Roadmap

### v1.0 - Initial Release
- [x] Basic chat functionality using DeepSeek-R1 LLM model.
- [x] WebSocket server/client for real-time communication.
- [x] Next.js front-end interface.

### v1.1 - Advanced Features
- [x] User authentication and session management.
- [x] Multi-platform support (e.g., mobile, desktop).
- [ ] NLP tuning for more accurate and contextual responses.
- [ ] Multi-language support.

### v2.0 - Scalability & Performance
- [ ] Horizontal scaling of WebSocket servers.
- [ ] Integration with external APIs for enhanced functionalities (e.g., weather, news).

### Future Enhancements
- [ ] Live demo site
- [ ] Support for voice-based interactions.
- [ ] Customizable chatbot personalities.

## Local Setup

To get started with AuraChat locally, follow the instructions below:

### Prerequisites
- Node.js (for running Next.js)
- Go (for WebSocket server)
- Docker (optional, for easier setup)

Steps to run the project locally
Clone the repository:

```bash
git clone https://github.com/zsliwoski/aura-chat.git
cd aura-chat
```

There are two ways to start both the frontend and LLM server

### Fast:
Create a .env file in the gpt-chat-frontend folder:

Copy the example example.env file or create your own .env file with the necessary environment variables (e.g., API keys, URLs).

Run the local startup bash script
```bash
chmod +x ./local_startup.sh
./local_startup.sh
```
Visit http://localhost:3000 to see the development server

### Manual:
Install front-end dependencies:

```bash
cd gpt-chat-frontend
npm install
```
Create a .env file in the gpt-chat-frontend folder:

Copy the example example.env file or create your own .env file with the necessary environment variables (e.g., API keys, URLs).

Build the Docker container for the backend:

```bash
cd gpt-chat-backend
docker build --progress=plain --no-cache -t gpt-chat-backend:latest .
```
Run the Docker container for the backend:

```bash
docker run -d -p 8080:8080 gpt-chat-backend
```
Start the Next.js application:

```bash
cd gpt-chat-frontend
npm run dev
```

Visit http://localhost:3000 in your browser to interact with the AI chatbot.

## Contributing
We welcome contributions from the community! If you want to contribute to AuraChat, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-xyz).
Make your changes and commit them (git commit -am 'Add new feature').
Push to the branch (git push origin feature-xyz).
Create a new Pull Request.

## Code of Conduct
Please adhere to the Code of Conduct while contributing.

## Issues
If you encounter any bugs or have feature requests, please open an issue on the repository’s GitHub page.

## License
AuraChat is open-source and distributed under the MIT License. See LICENSE for more details.

## Acknowledgments
- DeepSeek-R1 LLM model for advanced text prediction.
- Next.js for a robust and efficient front-end framework.
- Go WebSockets for real-time communication.

Built with ❤️ by the AuraChat Team