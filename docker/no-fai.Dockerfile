# QA fixture for o-industrial/open-industrial-reference-architecture#395: a custom Dockerfile that
# starts the workbench with plain deno, not with fai. OpenIndustrial must refuse it at deploy.
FROM denoland/deno:2.5.6
WORKDIR /app
COPY . .
CMD ["deno", "run", "-A", "workbenches/api/local.ts"]
