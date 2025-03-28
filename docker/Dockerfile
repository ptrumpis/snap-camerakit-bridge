FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install

COPY . /usr/src/app

RUN npm run build
RUN npx playwright install --with-deps chromium

EXPOSE 3000
EXPOSE 8080

CMD ["node", "docker/index.js"]
