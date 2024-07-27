# Chatroom App (but really, JWT Auth) 🔒

## What is this project ⁉️

1. Register and Login
2. Join a global chatroom
3. Get all the chat history
4. Send chats to everyone
5. Logout

Simple Chat app. Or more like toy app to learn about authentication.

## Why this project? 📚

Authentication is a difficult concept to grasp and implement, specially all on your own. I believe before using libraries that automate hardtasks, it is important that you try to implement your own version of the tool or concept to have a better understanding of what is happening under the hood. This helps when it comes to using these libraries too because you will understand what each API does and you will appreciate the simplicity and code.

Prior to this project, I had no experience with authentication and I was not familiar with any authentication concepts, let alone implementation. Hence, I decided to learn about one of the most widely forms of authentication, which is JWT or JSON Web Tokens. JWT is a stateless authentication method and it is used to secure webapps.

Here is my dummy understanding of it:
Client -> Sends request to server with username and password
server -> Verifies from the database the username and password is a match
Server -> Creates 2 tokens: access and refresh
Server -> Sends access token to the client via the response
Server -> Saves the refresh token as an httpOnly Cookie which the client cannot access
Client -> Uses access token to authenticate with the server for all protected requests
Server -> Verifies each proected request with the access token
Server -> If authenticated, sends the resposne of the proected request
Client -> If authentication fails the clients tries to obtain a new access token using the refresh token
Server -> Can verify the refresh token and send a new access token

## How you can use the project 🧠

Since the "business logic", ie the chatroom, of the project is minimal, you can use this as a template for any web application that requires authentication. This template is definitely not the state of art of authentication nor is it the state of art of JWT authentication. However, it is a cool way to perform auth without using ready-to-go tools or libraries.

## Disclaimer

I am by no means an expert in cyber security or authentication. So, if you find any flaws or incorrect code in this project, feel free to open a pull-request to fix it. I will not take any offense and just like you, I want to learn more
