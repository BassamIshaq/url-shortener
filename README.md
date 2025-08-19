# 🔗 URL Shortener Microservices on Kubernetes

A simple, production-ready URL shortener built as microservices and deployed on Kubernetes.

---

## 🚀 Quick Start

1. **Clone & Enter Project**
    git clone https://github.com/BassamIshaq/url-shortener.git
    cd url-shortener

2. **Build Docker Images**
    docker build -t shortener:latest ./services/shortener
    docker build -t redirect:latest ./services/redirect
    docker build -t analytics:latest ./services/analytics
    docker build -t frontend:latest ./frontend


3. **Deploy to Kubernetes**
    kubectl create namespace url-shortener
    kubectl apply -f k8s/ -n url-shortener
    kubectl get pods -n url-shortener
    kubectl get services -n url-shortener


---

## 🏗️ Architecture

- **Frontend** (nginx/static): User interface
- **Shortener** (Node.js): Creates short URLs
- **Redirect** (Node.js): Handles redirection
- **Analytics** (Node.js): Tracks clicks
- **MongoDB**: Data store

All services are containerized and exposed via Kubernetes services (type: LoadBalancer).

---

## 💡 Usage

- **Frontend**: Visit `http://localhost:[FRONTEND_PORT]`
- **API**: POST to `/shorten` with JSON `{ "originalUrl": "https://example.com" }`


