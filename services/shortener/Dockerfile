FROM node:18-alpine

WORKDIR /app

# Copy package.json first
COPY package.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy source code
COPY . .

EXPOSE 3001

CMD ["node", "app.js"]