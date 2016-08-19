FROM alpine:3.4
MAINTAINER o2r-project, https://o2r.info

RUN apk add --no-cache \
  nodejs \
  git \
  && git clone --depth 1 -b master https://github.com/o2r-project/o2r-supervisor /supervisor \
  && apk del git \
  && rm -rf /var/cache

WORKDIR /supervisor
RUN npm install

CMD npm start