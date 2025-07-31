# Use the official Nginx image
FROM nginx:alpine

# Remove default files and change Nginx port to 8080
RUN rm -rf /usr/share/nginx/html/* && \
    sed -i 's/listen .*/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Copy your app files
COPY . /usr/share/nginx/html

# Document that the container listens on 8080
EXPOSE 8080

# Start Nginx (already configured for port 8080)
CMD ["nginx", "-g", "daemon off;"]
