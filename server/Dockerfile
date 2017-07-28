FROM mhart/alpine-node
MAINTAINER Daniel Mitchell

ENV DIR=/server \
	PORT=3000

RUN mkdir ${DIR}
WORKDIR ${DIR}
COPY package.json ${DIR}
COPY package-lock.json ${DIR}
RUN npm install
COPY . ${DIR}

EXPOSE ${PORT}
CMD [ "npm", "start" ]
