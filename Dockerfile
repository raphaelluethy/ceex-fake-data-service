FROM node:18-alpine

WORKDIR /app
EXPOSE 3000

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

CMD npm run dev