FROM mcr.microsoft.com/playwright:v1.51.1-jammy

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm install --ignore-scripts --omit=dev

COPY . /usr/src/app

RUN npx playwright install --with-deps chromium

EXPOSE 3000
EXPOSE 8080

CMD ["node", "docker/index.js"]
