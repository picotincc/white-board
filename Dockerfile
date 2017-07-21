FROM ubuntu:14.04

RUN apt-get update && apt-get install -y git wget curl

WORKDIR /opt
git clone --depth=1 https://github.com/ging/licode.git

WORKDIR /opt/licode/scripts
RUN ./installUbuntuDeps.sh --cleanup --fase
RUN ./installErizo.sh
RUN ./installNuve.sh

ENTRYPOINT ["./initLicode.sh"]
