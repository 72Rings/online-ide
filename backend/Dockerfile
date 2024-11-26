FROM node:14

WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y g++ openjdk-11-jdk python3
RUN npm install

CMD ["node", "index.js"]
