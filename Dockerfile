FROM node:8
COPY ./ /src/app

WORKDIR /src/app

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "./launch.sh" ]
