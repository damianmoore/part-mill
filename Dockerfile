FROM debian:jessie

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
        rm -rf /var/lib/apt/lists/* \
               /tmp/* \
               /var/tmp/*

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs

COPY package.json /srv/package.json
ENV NPM_CONFIG_LOGLEVEL info
RUN npm install --prefix /srv

COPY * /srv/

RUN npm build

CMD ["node", "/srv/server.js"]

EXPOSE 3000
