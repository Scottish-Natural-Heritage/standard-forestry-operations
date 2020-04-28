# standard-forestry-operations

Apply for a Standard Forestry Operations licence

## Develop

```sh
npm run dev
```

## Test

```sh
npm run test
```

## Build

```sh
docker build -t naturescot/standard-forestry-operations .
```

## Run

```sh
docker run \
  --name standard-forestry-operations \
  --env SFO_SESSION_SECRET=override_this_value \
  --env SFO_API_URL=http://standard-forestry-operations-api:3003/standard-forestry-operations-api/v1/licenses \
  --network licensing \
  -p "3002:3002" \
  --detach \
  naturescot/standard-forestry-operations
```

## License

Unless stated otherwise, the codebase is released under the [MIT License](LICENSE.txt). The documentation is available under the terms of the [Open Government Licence, Version 3](LICENSE-OGL.md).

This software uses [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) - see [LICENSE-GOVUK.txt](LICENSE-GOVUK.txt).

This software uses [Google Roboto](https://github.com/google/roboto) - see [LICENSE-ROBOTO.txt](LICENSE-ROBOTO.txt).
