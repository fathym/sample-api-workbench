/**
 * API Workbench — launcher / Entry point.
 *
 * fai's workbench runner picks up the `export default` and instantiates the
 * workbench. OpenX Deploy passes `--mode API` (or another enabled mode).
 *
 * ## What this sample demonstrates
 *
 * The `APIMode()` factory (Track 6 Phase 9 D.9.1) auto-exposes every tool
 * method declared under `.Tools({...})` as a REST endpoint at
 * `POST /{lowerTool}/{methodName}`. Two tools with one method each below:
 *
 * - `POST /hello/greet`  — greet a name
 * - `POST /echo/echo`    — echo the request body back
 *
 * Plus APIMode's auto-served utility routes:
 * - `GET /openapi.json`  — auto-generated OpenAPI 3.x catalog
 * - `GET /health`         — SOP readiness probe
 *
 * Same `.Tools({...})` declaration would also serve MCP tools when
 * `.Modes({ MCP: MCPMode(), API: APIMode() })` — one workbench, multiple
 * client protocols.
 *
 * @module
 */
import { APIMode, Workbench, type WorkbenchBuilder } from '@fathym/fai/workbenches';
import { Tool } from '@fathym/fai/tools';
import { z } from 'zod';

const HelloTool = Tool(
  'hello',
  'Greet a name via a REST endpoint.',
)
  .Handle(z.object({
    Greet: z.function({
      input: z.tuple([
        z.string().default('world').describe('Name to greet.'),
      ]),
      output: z.promise(z.string()),
    }).describe('Return a friendly greeting for the provided name.'),
  }))
  .Execute((_ctx) =>
    Promise.resolve({
      Greet: (name = 'world') => Promise.resolve(`Hello from api-workbench, ${name}!`),
    })
  );

const EchoTool = Tool(
  'echo',
  'Echo the request payload back with a server timestamp.',
)
  .Handle(z.object({
    Echo: z.function({
      input: z.tuple([
        z.unknown().describe('Any JSON payload to echo.'),
      ]),
      output: z.promise(z.object({
        received: z.unknown(),
        ts: z.number(),
      })),
    }).describe('Echo the payload back, adding a receipt timestamp.'),
  }))
  .Execute((_ctx) =>
    Promise.resolve({
      Echo: (body: unknown) => Promise.resolve({ received: body, ts: Date.now() }),
    })
  );

const workbench: WorkbenchBuilder = Workbench(
  'api-sample',
  'Track 6 Phase 9 sample workbench demonstrating APIMode (REST hosting of workbench tools).',
)
  .Tools({ Hello: HelloTool, Echo: EchoTool })
  .Modes({ API: APIMode() });

export default workbench;
