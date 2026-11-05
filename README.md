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
   POST {workspace-origin}/ox-api/w/{workspace-id}/workbenches/api-sample/API/hello/greet
   POST {workspace-origin}/ox-api/w/{workspace-id}/workbenches/api-sample/API/echo/echo
   GET  {workspace-origin}/ox-api/w/{workspace-id}/workbenches/api-sample/API/openapi.json
   ```

   Auth: the sample's code sets no Auth. A mode's Auth is **Who may call this mode** in the inspector's **Modes**
   tab, and a mode that sets none takes the default, **Identity**. OpenX passes none of its own credentials on to
   the workbench. In front of an **Identity** mode, OpenX's address answers `403`
   (`WORKBENCH_LOGIN_NOT_REGISTERED`) until App Identity has registered the mode's app, and `403`
   (`WORKBENCH_SIGN_IN_UNCONFIRMED`) until a person has confirmed the mode, if it was set before workbenches
   checked their own callers. So on a freshly deployed batch the three routes above answer `403`, and that is
   OpenX's address closed, not this sample broken. Once the app is registered and the mode confirmed, OpenX
   forwards only a bearer issued for the mode's app. The mode is handed its login settings
   (`FATHYM_OX_WORKBENCH_LOGINS`) to check callers with. An open mode (Auth **None**) gets no login settings from
   OpenX and no check at its address, so it must check its own callers. This sample checks no caller itself, so
   add sign-in before it serves anything worth protecting:
   [Add Sign-in to Your Workbench](https://www.fathym.com/docs/openx/guides/workbenches/sign-in).

6. Open the workspace **API Explorer** → "Hosted Workbench APIs" tab → confirm the `api-sample` card shows both routes with copy-paste curl examples (populated from the OpenAPI catalog).

## Related

- **Track 6 v2 execution tracker**: [`o-industrial/oi-core-pack#61`](https://github.com/o-industrial/oi-core-pack/issues/61)
- **Phase 9 spec** (spec-drafting on `fathym-dev-space`): [`.workbench/.workstreams/2026-04-06-NewNodeCapabilities/track-6-workbench-node/phase-9-api-mode-hosting.md`](https://github.com/fathym-deno/fathym-dev-space/blob/feature/track-6-phases-9-10-11/.workbench/.workstreams/2026-04-06-NewNodeCapabilities/track-6-workbench-node/phase-9-api-mode-hosting.md)
- **MCP-mode counterpart sample**: [`fathym-deno/hello-workbench`](https://github.com/fathym-deno/hello-workbench)

## License

MIT
