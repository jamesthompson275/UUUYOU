FROM mhart/alpine-node:8.1.2
MAINTAINER Daniel Mitchell

ENV DIR=/app \
	PORT=8080

RUN mkdir ${DIR}
WORKDIR ${DIR}
COPY package.json ${DIR}
COPY package-lock.json ${DIR}
RUN npm install
COPY . ${DIR}

EXPOSE ${PORT}
CMD [ "npm", "run", "build" ]