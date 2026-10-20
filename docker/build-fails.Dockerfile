# QA fixture for fathym-deno/fathym-dev-space#392 (test plan R8): a custom Dockerfile that passes
# OpenIndustrial's checks (it starts the workbench with fai run) but whose build fails on purpose.
# OpenIndustrial must report the failed build, not deploy anything and not show a generic error.
FROM denoland/deno:bin AS deno_bin
FROM ubuntu:24.04
COPY --from=deno_bin /deno /usr/local/bin/deno
RUN echo "QA fixture: this build step fails on purpose" && false
CMD fai run $FATHYM_OX_WORKBENCH_ENTRY --mode=$FATHYM_OX_WORKBENCH_MODE
