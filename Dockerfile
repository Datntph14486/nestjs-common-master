FROM node:19.1.0

RUN npm i typescript ts-node -g

WORKDIR /opt/service
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
RUN npm install
# RUN npm audit fix

EXPOSE 3000

COPY . /opt/service
ENTRYPOINT [ "npm", "run", "start:prod" ]