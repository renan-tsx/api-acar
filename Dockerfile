FROM node
WORKDIR /usr/app
COPY package.json ./
RUN npm install

COPY . .

EXPOSE ${APP_PORT}

CMD ["npm", "run", "dev"]