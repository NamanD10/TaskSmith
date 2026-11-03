FROM node:22.19.0

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN ls -la && cat package.json

RUN npm install

COPY . /app/

RUN npm run build

CMD ["npm", "start"]