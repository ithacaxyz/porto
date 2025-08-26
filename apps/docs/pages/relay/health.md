# `health`

Health check for the Relay. Returns the version of the server.

## Request

```ts
type Request = {
  method: 'health',
}
```

## Response

```ts
type Response = {
  status: string;
  version: string;
}
```

## Example

```sh
cast rpc --rpc-url https://rpc.porto.sh health
```

```json
{
  "status": "rpc ok",
  "version": "21.0.2 (93ade40)"
}
```
