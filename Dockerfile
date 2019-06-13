FROM node:12 as builder

WORKDIR "/opt/app"

COPY . ./

RUN npm install
ARG configuration=production
ARG lang=fr

RUN npm run build -- --output-path=./dist/out --configuration $configuration
RUN npm run build -- --output-path=./dist/$lang --configuration $lang

FROM nginx:1.15 as runner

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /opt/app/dist/out /usr/share/nginx/html/en
COPY --from=builder /opt/app/dist/$lang /usr/share/nginx/html/$lang
COPY --from=builder /opt/app/default.conf /etc/nginx/conf.d/default.conf
