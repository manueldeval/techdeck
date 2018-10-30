FROM node:8
COPY ./ /src/app

WORKDIR /src/app

RUN npm install

# Running with a non-root user
USER node

EXPOSE 3000

ENTRYPOINT [ "./launch.sh" ]
