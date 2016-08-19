# o2r-supervisor

Collect status information from multiple microservices that are part of the [o2r web api](https://o2r.info/o2r-web-api).

Requirements:

- nodejs `>= 6.2`

## Dockerfile

This project includes a `Dockerfile` which can be built with

```bash
docker build -t o2r-supervisor .
```

The image can then be run and configured via environment variables.

### Available environment variables

- `SUPERVISOR_PORT`
  Define on which port the service should listen. Defaults to `8085`.
- `SUPERVISOR_MONGODB` __Required__
  Location for the mongo db. Defaults to `mongodb://localhost/`. You will very likely need to change this.
- `SUPERVISOR_MONGODB_DATABASE`
  Which database inside the mongo db should be used. Defaults to `muncher`.
- `SUPERVISOR_SESSION_COOKIE`
  Name of the cookie forwarded for authentication. Defaults to `connect.sid`.
- `SUPERVISOR_SESSION_COOKIE_URL`
  Url of the cookie forwarded for authentication. Defaults to `http://localhost`. You will very likely need to change this.

## Deployment

The endpoints from which JSON status messages are collected are hardcoded into the setting `c.endpoints` in `config.js`.

## Devlopment

You must provide the required settings as environment variables, either at start time or via the debug configuration of your IDE.

```bash
DEBUG=* npm start
```

You can then start the authenticate at the bouncer and, given your user has the appropriate level, see the collected status information at  http://localhost:8085/status.

## License

o2r bouncer is licensed under Apache License, Version 2.0, see file LICENSE.

Copyright (C) 2016 - o2r project.