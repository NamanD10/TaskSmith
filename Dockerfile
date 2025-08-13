FROM node:20

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN ls -la && cat package.json

RUN npm install

COPY . /app/

ENTRYPOINT ["node", "dist/index.js"]