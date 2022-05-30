FROM kong:latest

USER root

# # Copy configs to directory where Kong looks for effective configs
# COPY ./conf/ /etc/kong/

# # Copy Plugins to directory where kong expects plugin rocks
# COPY ./plugins/ /usr/local/kong/plugins/

# Copy scripts to starting location
COPY ./scripts/ .

ENV term xterm
RUN apk add --update vim nano

RUN apk update && apk add nodejs npm && npm install -g kong-pdk

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

ENTRYPOINT [ "./docker-entrypoint.sh"]

# EXPOSE 8000 8443 8001 8444 8002

STOPSIGNAL SIGQUIT

CMD ["kong", "docker-start"]

