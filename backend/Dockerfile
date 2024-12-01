# Use a smaller base image
FROM node:14-slim

# Set the working directory
WORKDIR /app

# Copy only package files first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Install system dependencies (keep it minimal)
RUN apt-get update && apt-get install -y g++ openjdk-11-jdk python3 && rm -rf /var/lib/apt/lists/*

# Expose the necessary port
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]
