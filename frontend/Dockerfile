FROM node:10

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]