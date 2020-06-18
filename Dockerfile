FROM node:12.16-alpine

WORKDIR /blog-post-annotation-mongo

COPY *.json /blog-post-annotation-mongo/
COPY ./src /blog-post-annotation-mongo/src

RUN apk add --no-cache dumb-init util-linux procps net-tools busybox-extras wget zip less && \
    npm ci && \
    npm install --save-dev source-map-support && \
    npm run build

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
