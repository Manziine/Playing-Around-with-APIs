# 💼 Skynza Jobs

**Skynza Jobs** is a modern, lightweight job search web application that delivers real-time listings through seamless integration with the **JSearch API**. Built entirely with **vanilla HTML, CSS, and JavaScript**, it offers a fast, responsive user experience across devices — complete with dynamic filtering, featured categories, and a sleek light/dark theme toggle.

Under the hood, Skynza Jobs is **Dockerized** and deployed across **two web servers**, with **HAProxy** handling **round-robin load balancing** to ensure reliability and scalability. Static assets are served via **Nginx**, and the entire setup is optimized for clarity, performance, and maintainability.

Whether you're exploring frontend development or showcasing deployment skills, Skynza Jobs demonstrates how clean design and solid infrastructure can come together in a focused, real-world project.

## 🚀 Features

- 🔍 **Real-Time Job Search**  
  Fetches up-to-date job listings using the JSearch API.

- 🧠 **Advanced Filtering**  
  Search by keyword, location, and job type for precise results.

- 💡 **Featured Categories**  
  Quick-access filters for popular job domains.

- 🌙 **Theme Switcher**  
  Toggle between light and dark modes for personalized viewing.

- 📱 **Responsive Design**  
  Optimized for both desktop and mobile devices.

- ⚡ **Smooth User Experience**  
  Includes loading spinners and graceful error handling for better usability.

## 🛠️ Tech Stack

| Layer       | Technology                     | Purpose                                      |
|-------------|--------------------------------|----------------------------------------------|
| Frontend    | HTML, CSS, JavaScript (Vanilla)| Build the user interface and handle logic    |
| API         | JSearch API                    | Fetch real-time job listings                 |
| Web Server  | Nginx                          | Serve static frontend files                  |
| Load Balancer| HAProxy                       | Distribute traffic across backend containers |
| Containerization | Docker                    | Package and run the app in isolated containers|


## 📦 Deployment Overview

Skynza Jobs is deployed using a multi-container setup to ensure scalability and fault tolerance. Here's how it's structured:

- 🐳 **Dockerized Frontend**  
  The app runs inside lightweight Docker containers for consistency and portability.
screenshot:

<img width="1079" height="284" alt="image d" src="https://github.com/user-attachments/assets/ada9524c-d7a4-41fb-bf7c-4862671f175f" />

- 🌐 **Two Web Servers**  
  Identical containers serve the frontend, allowing for load-balanced traffic.
screenshot :

<img width="1553" height="106" alt="docker ps showing containers" src="https://github.com/user-attachments/assets/883111e8-57d7-49a7-ab1c-51b137921aa2" />

- 🔁 **HAProxy Load Balancer**  
  Configured with round-robin strategy to evenly distribute requests between the two servers.

screenshot :


<img width="1142" height="213" alt="alternations" src="https://github.com/user-attachments/assets/94401ec6-646a-4c6a-8f84-559a05aa1bfb" />

- 🧭 **Nginx Reverse Proxy**  
  Serves static files and handles routing within each container.

- 🧹 **Clean Environment**  
  Unused containers and images are removed to maintain a tidy and conflict-free setup.

screenshot:
<img width="1558" height="104" alt="docke ps" src="https://github.com/user-attachments/assets/c983f886-5088-46ae-a539-dfd7b69851ea" />

## 🧪 Setup & Usage

Follow these steps to run Skynza Jobs locally with Docker and HAProxy.

### 1. Clone the Repository

bash
git clone https://github.com/your-username/skynza-jobs.git
cd skynza-jobs

Build the Frontend Image
docker build -t skynza-frontend ./frontend

 Run Two Frontend Containers

docker run -d --name web1 -p 8081:80 skynza-frontend
docker run -d --name web2 -p 8082:80 skynza-frontend

START THE load balancer (HAPROXY)
docker run -d --name haproxy \
  --network host \
  -v "$(pwd)/haproxy.cfg":/usr/local/etc/haproxy/haproxy.cfg:ro \
  haproxy:latest

 Access the App
http://localhost:8080

Cleanup

docker stop haproxy web1 web2
docker rm haproxy web1 web2

