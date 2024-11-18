FROM denoland/deno:alpine-1.46.3 AS builder

RUN mkdir -p /workspace

WORKDIR /workspace

COPY .denomon .denomon
COPY core core
COPY dist dist
COPY lib lib
COPY deno.jsonc deno.jsonc
COPY ship/web/wrangler.toml ship/web/wrangler.toml

ENV DENOMON_WORKSPACE_DIR="/workspace"
ENV DENOMON_ARTIFACTS_DIR="/workspace/.denomon/artifacts"
ENV DENOMON_KITS_FILE="/workspace/.denomon/kits.json"
ENV DENOMON_KITS_DIR="/workspace/.denomon/kits"


# Compile denomon cli
# There's some issue with compiling with `deno compile` in the docker image
# see https://github.com/denoland/deno_docker/issues/369
RUN mkdir -p /workspace/.denomon/bin
RUN deno compile -L debug --allow-all --output /workspace/.denomon/bin/denomon /workspace/.denomon/cli/main.ts
ENV PATH="$PATH:/workspace/.denomon/bin"

RUN denomon build web
RUN denomon build worker
