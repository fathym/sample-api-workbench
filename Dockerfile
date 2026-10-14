# QA fixture for o-industrial/open-industrial-reference-architecture#395: a custom Dockerfile that
# starts the workbench with fai run, from the entry OpenIndustrial passes in. Based on the Dockerfile
# OpenIndustrial generates for a GitHub source.
FROM denoland/deno:bin AS deno_bin
FROM ubuntu:24.04
COPY --from=deno_bin /deno /usr/local/bin/deno
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN deno cache --allow-import workbenches/api/local.ts || true
RUN deno install -A -g -n fai jsr:@fathym/fai@0.0.888
ENV PATH=/root/.deno/bin:$PATH
CMD printf %s "$FATHYM_OX_WORKBENCH_MODE_CONFIG" > /tmp/mode-config.json && fai run $FATHYM_OX_WORKBENCH_ENTRY --mode=$FATHYM_OX_WORKBENCH_MODE --config=/tmp/mode-config.json
