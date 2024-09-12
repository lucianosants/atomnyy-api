# Atomnyy API


![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

  
Atomnyy API is an application built with **Nest.js** and **PostgreSQL** to serve the main [Atomnyy - Lista de Compras](#). A straightforward, no-nonsense app to help you organize your supermarket shopping in a simple, direct, and intuitive way.

## Technologies
- Node.js
- Nest.js
- TypeScript
- TypeORM
- PostgreSQL
- Docker and Compose
- Swagger
- Jest

## Deployment
There is a dedicated **Dockerfile** and **docker-compose** setup to accommodate deployment on various hosting platforms.

## Development
### Requirements
- **Node.js**
- **Docker** and **docker-compose**
- **Dev Containers** Visual Studio Code extension **(optional)**

To run the project locally, ensure you have [Node.js](https://nodejs.org/en), [Docker and docker-compose](https://www.docker.com/) installed and configured on your machine.

### To start **local development**, run:

```shell
docker compose -f .devcontainer/docker-compose.yml up -d
docker compose -f .devcontainer/docker-compose.yml exec api sh bin/setup
docker compose -f .devcontainer/docker-compose.yml exec api sh bin/dev

```

These commands will spin up the necessary **containers** and **images** to run the application in **development mode**, create **database migrations**, and **start** the **Nest.js development server**. After that, access the **API** at `localhost` on port `3000`.


## Dev Containers
In **IDEs** that support **Development Containers**, such as **Visual Studio Code**, you can start the application locally using the [Dev Containers extension](https://containers.dev/supporting#dev-containers). The build commands should run automatically, utilizing the **integrated terminal**.


## Running Tests
**Unit** and **e2e testing** support is available in this project. You can run the following commands:

```shell
docker compose -f .devcontainer/docker-compose.yml exec api sh bin/test-unit
docker compose -f .devcontainer/docker-compose.yml exec api sh bin/test-e2e

```


## Contributing

See something that can be added or improved? Feel free to **contribute**! You can **fork** the project and submit a **pull request**.


## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.




