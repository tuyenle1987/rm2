FROM node:18

WORKDIR /rm2/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080

CMD ["node", "dist/main"]
