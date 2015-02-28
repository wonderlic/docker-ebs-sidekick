FROM wonderlic/nodejs:0.10.36
MAINTAINER Wonderlic DevOps <DevOps@wonderlic.com>

COPY node_modules /app/node_modules
COPY index.js /app/index.js

ln -s /usr/bin/node /usr/bin/node-ebs-sidekick

CMD ["node-ebs-sidekick", "/app/index.js"]
