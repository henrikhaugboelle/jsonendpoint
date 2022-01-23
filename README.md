# jsonendpoint.com

A simple JSON endpoint API that supports `GET`, `POST`, `PUT`, and `DELETE` operations built upon [Cloudflare](https://www.cloudflare.com/) technologies [Workers](https://workers.cloudflare.com/) and [KV storage](https://www.cloudflare.com/products/workers-kv/).

A hosted version free-to-use for hobby and open source projects is available at [jsonendpoint.com](https://jsonendpoint.com).

## Installation

To run your own copy of [jsonendpoint.com](https://jsonendpoint.com) follow the steps below:

1. Follow the steps in the [Get started guide](https://developers.cloudflare.com/workers/get-started/guide) for [Cloudflare Workers](https://workers.cloudflare.com/).

2. When using `wrangler` to generate a project, point to this github repository:

```
$ wrangler generate my-jsonendpoint https://github.com/henrikhaugboelle/jsonendpoint
```

3. Fill in the missing values of the `wrangler.toml` file for `account_id`, `preview_id` and `id` for `kv_namespaces`, and `route` and `zone_id` if you plan on [using your own domain](https://developers.cloudflare.com/workers/get-started/guide#optional-configure-for-deploying-to-a-registered-domain).

4. To test your project locally run `wrangler dev` which starts a local server exposing an endpoint for you to invoke your worker function:

```
$ wrangler dev
```


5. To publish your project run `wrangler publish` which will build and deploy the worker to Cloudflare:

```
$ wrangler publish
```

## API

Anyone can read, write, and delete JSON data from any endpoint, there is no authentication or authorization. It's encouraged that you make part of the pathname unique to avoid collisions.

The URL pathname is used as the key in the key-value store. The key is case sensitive and trailing slashes are not ignored.

Replace `jsonendpoint.com` in the documention below with your Cloudflare worker subdomain or custom domain.


### `GET` – Read data

To read data from an endpoint use any HTTP client to issue a `GET` request.

```
$ curl https://jsonendpoint.com/my/unique/endpoint

// 200 response if data is found at the endpoint:
→ { "value": 42 }

// 404 response if no data has been written to the endpoint:
→ { "message": "Not Found" }
```

### `POST` / `PUT` – Write data

To write data to an endpoint you must issue a `POST` or `PUT` request. Upon a successful write, the API will return an empty JSON response with http code 200.

Any data that already exists at the endpoint will be overwritten.

```
$ curl https://jsonendpoint.com/my/unique/endpoint \
  --request `POST` \
  --data '{ "value": 42 }'

// 200 response if the write was successful:
→ {}
```

### `DELETE` – `Delete` data

To delete data at an endpoint you must issue a `DELETE` request. Upon successful deletion, the API will return an empty JSON response with http code 200.

The delete operation will still succeed even if no data exists at the endpoint.

```
$ curl https://jsonendpoint.com/my/unique/endpoint \
  --request `DELETE`

// 200 response if the deletion was successful:
→ {}
```

### Errors

If an error occurs, for example if you fail to provide a valid JSON payload for the `POST` or `PUT` operations, the request will fail with http code 400 bad request:

```
$ curl https://jsonendpoint.com/my/unique/endpoint \
  --request `POST`

// 400 if json payload is missing or invalid:
→ { "message": "Bad Request" }
```

## Author

Built by [henrik.dev](https://henrik.dev) in Copenhagen, Denmark 2022
