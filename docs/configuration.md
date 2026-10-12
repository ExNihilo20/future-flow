# FutureFlow Configuration

FutureFlow uses NestJS `ConfigModule` and `ConfigService` to provide centralized application configuration for the backend.

Local configuration values are maintained in a root-level `.env` file. Docker Compose reads this file and supplies the appropriate values to the FutureFlow containers. NestJS then accesses application configuration through `ConfigService`.

## Configuration Flow

The general configuration flow is:

```text
.env
  |
  +--> Docker Compose
  |       |
  |       +--> PostgreSQL
  |       +--> API
  |       +--> Web build
  |
  +--> NestJS ConfigModule
             |
             +--> ConfigService
                    |
                    +--> Application startup
                    +--> Authentication
                    +--> Logging
```

Prisma uses `DATABASE_URL` from the environment for database connectivity and migration operations.

## Configuration Files

### `.env`

The root-level `.env` file contains the actual configuration used for local development.

Example location:

```text
future_flow/.env
```

This file must not be committed to Git because it may contain passwords, JWT secrets, database connection information, and other environment-specific values.

The root `.gitignore` excludes `.env` from version control.

### `.env.example`

The root-level `.env.example` file documents the properties required or supported by FutureFlow.

This file is committed to Git.

Developers can use `.env.example` as a template when creating their local `.env` file.

Do not place real passwords, JWT secrets, production database credentials, or other sensitive values in `.env.example`.

## Current Properties

### PostgreSQL

```text
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
```

These properties configure the PostgreSQL container used by the local Docker environment.

Example:

```dotenv
POSTGRES_USER=futureflow
POSTGRES_PASSWORD=futureflow
POSTGRES_DB=futureflow
```

### Database

```text
DATABASE_URL
```

`DATABASE_URL` contains the PostgreSQL connection URL used by Prisma.

Example for the Docker environment:

```dotenv
DATABASE_URL=postgresql://futureflow:futureflow@postgres:5432/futureflow?schema=public
```

The hostname `postgres` refers to the PostgreSQL service defined in `docker-compose.yml`.

`DATABASE_URL` is a required FutureFlow configuration property.

### NestJS API

```text
API_PORT
```

`API_PORT` controls the port on which the NestJS API listens.

Example:

```dotenv
API_PORT=3000
```

The application retrieves this setting through NestJS `ConfigService`.

If the property is not supplied, the application uses port `3000` as its default.

### Authentication

```text
JWT_SECRET
JWT_EXPIRES_IN
```

`JWT_SECRET` contains the secret used to sign and validate JSON Web Tokens.

Example local development value:

```dotenv
JWT_SECRET=change-me-for-local-development
```

`JWT_SECRET` is required. A real deployment must use a strong secret rather than the local development example.

`JWT_EXPIRES_IN` controls how long issued authentication tokens remain valid.

Example:

```dotenv
JWT_EXPIRES_IN=7d
```

If `JWT_EXPIRES_IN` is not supplied, FutureFlow currently uses `7d` as its default.

Authentication components retrieve JWT configuration through NestJS `ConfigService`.

### Logging

FutureFlow supports the following logging properties:

```text
LOG_LEVEL
LOG_MAX_SIZE
LOG_MAX_FILES
```

Example:

```dotenv
LOG_LEVEL=info
LOG_MAX_SIZE=5242880
LOG_MAX_FILES=5
```

`LOG_LEVEL` controls the minimum application logging level.

`LOG_MAX_SIZE` controls the maximum size of an individual Winston log file in bytes before rollover.

For example:

```text
5242880 bytes = 5 MB
```

`LOG_MAX_FILES` controls the number of rolled log files retained by Winston.

These properties are retrieved through `ConfigService` by `AppLoggerService`.

Current application defaults are:

```text
LOG_LEVEL=info
LOG_MAX_SIZE=5242880
LOG_MAX_FILES=5
```

### Log Directory

`LOG_DIR` identifies the directory where FutureFlow writes its application log files.

Unlike the general logging properties, `LOG_DIR` is intentionally not defined in the root local `.env` file because its appropriate value depends on the runtime environment.

In Docker, `docker-compose.yml` supplies:

```text
LOG_DIR=/var/log/futureflow
```

The Docker volume mapping connects that container directory to:

```text
./logs
```

in the FutureFlow repository.

When FutureFlow runs natively and `LOG_DIR` is not configured, the application determines an appropriate location for the operating system.

Windows uses the user's local application-data location under:

```text
FutureFlow/logs
```

macOS uses:

```text
~/Library/Logs/FutureFlow
```

Linux uses the XDG state directory when available, or otherwise:

```text
~/.local/state/futureflow/logs
```

Operating-system properties such as `LOCALAPPDATA`, `APPDATA`, and `XDG_STATE_HOME` are read directly from the operating system. They are not FutureFlow application properties.

### Angular API URL

```text
API_BASE_URL
```

This property identifies the FutureFlow API URL used when building the Angular application.

Example:

```dotenv
API_BASE_URL=http://localhost:3000/api/v1
```

Docker Compose passes this value as a build argument to the web application.

## Required Configuration

FutureFlow validates required application configuration when NestJS starts.

The currently required properties are:

```text
DATABASE_URL
JWT_SECRET
```

Configuration validation is performed by:

```text
src/config/validate-config.ts
```

If either required property is missing or blank, application startup fails.

For example, starting FutureFlow with an empty `JWT_SECRET` results in an error similar to:

```text
Missing required configuration: JWT_SECRET
```

This prevents the NestJS application from starting with known-invalid required configuration.

Properties with reasonable application defaults, such as `API_PORT`, `JWT_EXPIRES_IN`, and the logging settings, do not need to be present for startup validation to succeed.

## NestJS Configuration Access

Backend application components should use NestJS `ConfigService` to retrieve FutureFlow application properties rather than accessing `process.env` directly.

Conceptually:

```text
Environment
    |
ConfigModule
    |
ConfigService
    |
Application component
```

For example, application startup retrieves `API_PORT` through `ConfigService`, while authentication retrieves JWT configuration through the same mechanism.

This provides one consistent configuration mechanism across backend components.

Direct `process.env` access should generally be avoided for FutureFlow application properties.

The exception is operating-system environment information used to determine native platform behavior, such as `LOCALAPPDATA`, `APPDATA`, and `XDG_STATE_HOME`.

## Docker Configuration

Docker Compose automatically reads the root `.env` file when commands are run from the FutureFlow project directory.

The Compose configuration passes the necessary properties into the appropriate containers.

For example:

```yaml
environment:
  DATABASE_URL: ${DATABASE_URL}
  JWT_SECRET: ${JWT_SECRET}
  JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
  API_PORT: ${API_PORT}
  LOG_LEVEL: ${LOG_LEVEL}
  LOG_MAX_SIZE: ${LOG_MAX_SIZE}
  LOG_MAX_FILES: ${LOG_MAX_FILES}
  LOG_DIR: /var/log/futureflow
```

This keeps environment-specific values in the configuration file while `docker-compose.yml` defines how those values are supplied to the containers.

## Changing Configuration

For local development, modify the root `.env` file.

For example, to increase retained log files:

```dotenv
LOG_MAX_FILES=10
```

or to change the log rollover size to approximately 10 MB:

```dotenv
LOG_MAX_SIZE=10485760
```

When configuration supplied to a Docker container changes, recreate the affected container so the new environment is applied.

For example:

```bash
docker compose up -d
```

A source-code rebuild is not normally required solely because an environment property value changed.

## Security

Do not commit the root `.env` file.

Do not commit real:

- JWT secrets
- database passwords
- production database URLs containing credentials
- authentication credentials
- API secrets
- other sensitive environment-specific values

The committed `.env.example` file should contain placeholders or safe local-development examples only.

Production secrets should be supplied by the deployment environment rather than stored in the repository.

## Adding New Configuration

When a new FutureFlow configuration property is introduced:

1. Add the property to `.env.example`.
2. Add the appropriate local value to `.env` when needed.
3. Pass the property through Docker Compose if the container requires it.
4. Access backend application properties through `ConfigService`.
5. Add the property to startup validation if FutureFlow cannot operate safely without it.
6. Update this document to describe the property, its purpose, and any default behavior.

This keeps FutureFlow configuration centralized, documented, and consistent across application components and runtime environments.