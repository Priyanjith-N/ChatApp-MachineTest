FROM node:20.12.0

WORKDIR /Chat App Server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]