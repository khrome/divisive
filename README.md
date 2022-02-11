divisive
========
Shard datasets by streaming through them, or just transform to json for manipulation with [jq](https://stedolan.github.io/jq/), [mongo](https://www.mongodb.com/) or [mangrove](https://www.npmjs.com/package/mangrove).

Usage
-----

```bash
dsv parse path/to/my/file.type > output.json
```

```bash
dsv parse path/to/my/file.type | jq '.'
```
