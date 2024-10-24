FROM nginxinc/nginx-unprivileged:1.27.2
RUN rm /etc/nginx/conf.d/*
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]