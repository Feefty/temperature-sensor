# Temperature API

This application is an API to monitor temperatures, with the ability to set thresholds for sensor states (HOT, COLD, WARM) using GraphQL. The application is built with NestJS and follows hexagonal architecture principles.

## Prerequisites

- Docker
- Docker Compose

# Usage

## Start the Application with Docker Compose

To start the application with Docker Compose, use the following command:

```bash
$ docker compose -f compose.yaml up --build
``````

This will start the Docker containers for the application.

## Access GraphQL Playground

Once the containers are up and running, you can access the GraphQL Playground to interact with the GraphQL API: http://localhost:3000/graphql

## Example GraphQL Queries

### Get Current Temperature

```gql
query {
  getCurrentTemperature {
    value
    timestamp
  }
}
```

### Get Temperature History

```gql
query {
  getTemperatureHistory {
    value
    timestamp
  }
}
``````

### Set Temperature Thresholds

```gql
mutation {
  setThresholds(hot: 36, cold: 20)
}
```

### Get Sensor State

```gql
query {
  getSensorState {
    id
    state
  }
}
```

# Tech Stack
- Node.js: Runtime environment for the server.
- NestJS: Framework used to structure the application.
- GraphQL: Used for the API.
- Jest: Used for testing.
- Docker: Used for containerization.
- Docker Compose: Used to orchestrate the Docker containers.

# Development

## Install Dependencies

If you want to develop and test locally without Docker, you can install the dependencies with Yarn:

```bash
$ yarn install
```

## Start the Application in Development Mode

```bash
$ yarn start:dev
```

## Run Tests

```bash
$ yarn test
```

# Project Structure
- `src/app.module.ts`: Main module of the application.
- `src/domain`: Contains domain entities and interfaces.
- `src/application`: Contains application use cases.
- `src/infrastructure`: Contains adapters, services, and repositories.
- `src/config`: Contains configuration services.
- `src/temperature-sensor`: Contains temperature and sensor related services, resolvers, and modules.
