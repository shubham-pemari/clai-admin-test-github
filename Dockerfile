# The tag here should match the Meteor version of your app, per .meteor/release
FROM geoffreybooth/meteor-base:2.0

# Copy app package.json and package-lock.json into container
COPY ./botfront/package*.json $APP_SOURCE_FOLDER/
COPY ./botfront/postinstall.sh $APP_SOURCE_FOLDER/
ARG ARG_NODE_ENV=production
ENV NODE_ENV $ARG_NODE_ENV
ENV DISABLE_CLIENT_STATS 1
# Increase Node memory for build
ENV TOOL_NODE_FLAGS --max-old-space-size=4096

# Copy app source into container

RUN apt-get update && apt-get install -y ssh

RUN mkdir -p ~/.ssh

RUN ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

ENV GIT_SSH_COMMAND "ssh -i ~/.ssh/id_ed25519"

ARG SSH_KEY

ENV SSH_KEY $SSH_KEY

RUN echo "$SSH_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519

COPY ./botfront $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

RUN chmod 600 $APP_SOURCE_FOLDER

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh

# Use Debian, because nodegit is too hard to get to work with
# Alpine >=3.8
FROM node:14-buster-slim
RUN apt-get update && apt-get install -y python g++ build-essential

ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker

# Copy in entrypoint
COPY --from=0 $SCRIPTS_FOLDER $SCRIPTS_FOLDER/
# COPY ./entrypoint.sh $SCRIPTS_FOLDER
# RUN chmod +x $SCRIPTS_FOLDER/entrypoint.sh

# Copy in app bundle
COPY --from=0 $APP_BUNDLE_FOLDER/bundle $APP_BUNDLE_FOLDER/bundle/

#RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

# Nodegit dependencies
RUN apt-get update && apt-get install -y libgssapi-krb5-2
RUN npm install --prefix $APP_BUNDLE_FOLDER/bundle/programs/server nodegit

# Those dependencies are needed by the entrypoint.sh script
#RUN npm install -C $SCRIPTS_FOLDER p-wait-for mongodb
RUN chgrp -R 0 $SCRIPTS_FOLDER && chmod -R g=u $SCRIPTS_FOLDER

VOLUME [ "/app/models"]
ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["node", "main.js"]