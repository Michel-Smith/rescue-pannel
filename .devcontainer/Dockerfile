# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.187.0/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version: bionic, focal
ARG VARIANT="focal"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
RUN apt-get update
RUN apt-get install -y php7.4 php7.4-xdebug php7.4-zip php7.4-gd php7.4-dom php7.4-curl php7.4-mbstring php7.4-fpm php7.4-cli php7.4-mysql
RUN apt-get install -y composer nodejs npm
RUN npm install --global yarn

