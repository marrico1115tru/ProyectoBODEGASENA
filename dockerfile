FROM node:22.14-alpine3.20

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_API_CLIENT='http://localhost:3000/'

CMD ["npm", "run", "dev"]
