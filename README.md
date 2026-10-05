# @fathym/sample-api-workbench

Track 6 Phase 9 sample workbench demonstrating **APIMode** — REST hosting of workbench tools inside an OpenX workspace. Published to JSR as [`@fathym/sample-api-workbench`](https://jsr.io/@fathym/sample-api-workbench).

Sibling to [`hello-workbench`](https://github.com/fathym-deno/hello-workbench) (the MCP-mode counterpart).

## What it demonstrates

Two `Tool()` builders, each declaring one method, wired into a `Workbench().Modes({ API: APIMode() })`. When deployed via OpenX, `APIMode` auto-exposes every tool method as a REST endpoint at `POST /{lowerTool}/{methodName}`:

| Route                | Method                  | Behavior                                    |
| -------------------- | ----------------------- | ------------------------------------------- |
| `POST /hello/greet`  | `HelloTool.Greet(name)` | Returns `Hello from api-workbench, {name}!` |
| `POST /echo/echo`    | `EchoTool.Echo(body)`   | Returns `{ received: body, ts: <unix-ms> }` |
| `GET  /openapi.json` | (auto)                  | OpenAPI 3.x catalog of the two routes       |
| `GET  /health`       | (auto)                  | Readiness probe (200 OK)                    |

Same `.Tools({...})` declaration would also serve MCP tools when `.Modes({ MCP: MCPMode(), API: APIMode() })` — one workbench, multiple client protocols.

## Run it

Straight from JSR, no clone needed:

```
fai run jsr:@fathym/sample-api-workbench --mode API
```

Or from a clone:

```
deno task api
```

Either starts a local HTTP server on `http://localhost:4968`. Then in another terminal:

```
curl -X POST http://localhost:4968/hello/greet -d '{"arg0":"OpenX"}' -H 'Content-Type: application/json'
# → "Hello from api-workbench, OpenX!"

curl -X POST http://localhost:4968/echo/echo -d '{"arg0":{"foo":"bar"}}' -H 'Content-Type: application/json'
# → {"received":{"foo":"bar"},"ts":1755600000000}

curl http://localhost:4968/openapi.json | jq .paths
# → { "/hello/greet": {...}, "/echo/echo": {...} }
```

## Deploy via OpenX

1. In your workspace, drag a **SurfaceWorkbench** onto a surface.
2. In the inspector **Source** tab, point at:
   - Repo: `https://github.com/fathym/sample-api-workbench`
   - Ref: `main` (or pin a commit/tag)
   - Entry: `workbenches/api/local.ts`
3. In the **Hosting** tab, set **APISlug** (e.g. `api-sample`).
4. In the **Modes** tab (after first deploy), enable **API**.
5. Deploy. Once `HostingStatus` is `Running`, the routes become reachable at:

   ```
   POST {workspace-origin}/oi-api/workbenches/api-sample/API/hello/greet
   POST {workspace-origin}/oi-api/workbenches/api-sample/API/echo/echo
   GET  {workspace-origin}/oi-api/workbenches/api-sample/API/openapi.json
   ```

   Auth: Bearer JWT with `Workspace.Workbench.Host` access right.

6. Open the workspace **API Explorer** → "Hosted Workbench APIs" tab → confirm the `api-sample` card shows both routes with copy-paste curl examples (populated from the OpenAPI catalog).

## Related

- **Track 6 v2 execution tracker**: [`o-industrial/oi-core-pack#61`](https://github.com/o-industrial/oi-core-pack/issues/61)
- **Phase 9 spec** (spec-drafting on `fathym-dev-space`): [`.workbench/.workstreams/2026-04-06-NewNodeCapabilities/track-6-workbench-node/phase-9-api-mode-hosting.md`](https://github.com/fathym-deno/fathym-dev-space/blob/feature/track-6-phases-9-10-11/.workbench/.workstreams/2026-04-06-NewNodeCapabilities/track-6-workbench-node/phase-9-api-mode-hosting.md)
- **MCP-mode counterpart sample**: [`fathym-deno/hello-workbench`](https://github.com/fathym-deno/hello-workbench)

## License

MIT
