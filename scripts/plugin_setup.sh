#!/bin/bash

echo "Starting to Install custom plugins"
## For each custom plugin
## cd /usr/local/custom/kong/plugins/<plugin_name>
## luarocks make

# apk update && apk add nodejs npm python2 make g++ && npm install -g kong-pdk


cd /usr/local/kong/plugins/kong-middleman-plugin
luarocks make

cd /usr/local/kong/plugins/kong-external-auth
luarocks make

cd /usr/local/kong/plugins/request-intercept
luarocks make


echo "Done Installing custom plugins"