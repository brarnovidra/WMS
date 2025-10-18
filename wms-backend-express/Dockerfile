FROM node:22.19.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm run db:reseed && npm start"]
