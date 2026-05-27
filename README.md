# Microservices Voting Application

A fully containerized microservices-based voting application built using Python, Redis, .NET, PostgreSQL, Node.js, Docker, and Docker Compose.

This project was created as a hands-on learning journey to understand:

- Microservices architecture
- Containerization with Docker
- Docker networking and service discovery
- Asynchronous processing using Redis queues
- Stateful vs stateless services
- Persistent storage using Docker volumes
- Infrastructure orchestration with Docker Compose
- Real-time frontend updates using polling

---

# Architecture

```text
Browser
   ↓
Vote App (Flask)
   ↓
Redis Queue
   ↓
.NET Worker Service
   ↓
PostgreSQL Database
   ↓
Result App (Node.js)
```

All services communicate internally using Docker Compose networking.

---

# Tech Stack

## Frontend / APIs

- Python Flask
- Node.js Express

## Backend Processing

- .NET Worker Service
- Redis Queue

## Database

- PostgreSQL

## Infrastructure

- Docker
- Docker Compose

---

# Features

- Vote for Cats or Dogs
- Asynchronous vote processing
- Redis-based message queue
- PostgreSQL persistent storage
- Real-time result updates
- Fully containerized services
- Docker Compose orchestration
- Automatic database initialization
- Persistent PostgreSQL volumes

---

# Project Structure

```text
voting-app/
│
├── vote-app/
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
│
├── worker/
│   ├── Dockerfile
│   ├── Worker.cs
│   └── Program.cs
│
├── result-app/
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
│
├── docker-compose.yml
├── init.sql
└── README.md
```

---

# How It Works

## 1. Vote App

The Flask application allows users to vote for Cats or Dogs.

Votes are pushed into Redis instead of directly writing to the database.

This demonstrates asynchronous architecture.

---

## 2. Redis Queue

Redis acts as a message broker.

Votes are temporarily stored in a queue until the worker service processes them.

This decouples the frontend from the database layer.

---

## 3. Worker Service

The .NET worker continuously listens to the Redis queue.

Whenever a new vote appears:

- Worker consumes the message
- Processes the vote
- Stores it in PostgreSQL

---

## 4. PostgreSQL

PostgreSQL stores all votes persistently.

Docker volumes are used to ensure data survives container restarts.

---

## 5. Result App

The Node.js application reads vote counts from PostgreSQL.

The UI auto-refreshes every few seconds using client-side polling.

---

# Running the Application

## Prerequisites

- Docker
- Docker Compose

---

## Start All Services

```bash
docker compose up -d
```

---

## Stop All Services

```bash
docker compose down
```

---

## Remove Containers + Volumes

```bash
docker compose down -v
```

---

# Access Applications

## Vote Application

```text
http://localhost:5001
```

## Result Dashboard

```text
http://localhost:3000
```

---

# Docker Concepts Learned

This project helped in understanding:

- Docker images
- Docker containers
- Docker networking
- Bridge networks
- Port publishing
- Service discovery
- Container lifecycle
- Persistent volumes
- Docker Compose orchestration
- Infrastructure as Code

---

# Key Learning Outcomes

## Container Networking

Services communicate using container names:

```text
redis
postgres
worker
```

instead of localhost.

---

## Stateless vs Stateful Services

### Stateless

- vote-app
- worker
- result-app

### Stateful

- PostgreSQL

---

## Asynchronous Architecture

Frontend does not directly write to the database.

Redis queues requests for background processing.

---

## Real-Time Updates

Result dashboard uses frontend polling to fetch updated vote counts automatically.

---

# Future Improvements

- Kubernetes deployment
- Nginx reverse proxy
- Horizontal scaling
- Health checks
- CI/CD pipelines
- Monitoring and observability
- Persistent Kubernetes volumes
- WebSocket-based live updates

---

# Screenshots

_Add screenshots of the vote app and result dashboard here._

## Vote Application

![Vote App](screenshots/vote-app.png)

---

## Result Dashboard

## ![Result Dashboard](screenshots/result-dashboard.png)

# Author

Built as a hands-on microservices and Docker learning project.
