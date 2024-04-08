FROM node:19-alpine3.16

# install app dependencies
COPY package.json /app/
COPY package-lock.json /app/
COPY src /app/src
COPY public /app/public

WORKDIR /app
RUN npm install --silent

# start app
CMD ["npm", "start"]