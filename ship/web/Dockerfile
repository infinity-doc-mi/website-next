FROM denoland/deno:alpine-2.0.6 AS builder

RUN mkdir -p /workspace

WORKDIR /workspace

COPY .denomon .denomon
COPY core core
COPY dist dist
COPY lib lib
COPY deno.jsonc deno.jsonc
COPY deno.lock deno.lock
COPY ship/wrangler.toml ship/wrangler.toml

ENV DENOMON_WORKSPACE_DIR="/workspace"
ENV DENOMON_ARTIFACTS_DIR="/workspace/.denomon/artifacts"
ENV DENOMON_KITS_FILE="/workspace/.denomon/kits.json"
ENV DENOMON_KITS_DIR="/workspace/.denomon/kits"


# Compile denomon cli
# There's some issue with compiling with `deno compile` in the docker image
# see https://github.com/denoland/deno_docker/issues/369
RUN mkdir -p /workspace/.denomon/bin
RUN deno compile --allow-all --output /workspace/.denomon/bin/denomon /workspace/.denomon/cli/main.ts
ENV PATH="$PATH:/workspace/.denomon/bin"

RUN denomon build web
RUN denomon build worker

FROM jfxs/wrangler AS publisher

COPY --from=builder /workspace/.denomon/artifacts/web /workspace/web
COPY --from=builder /workspace/.denomon/artifacts/worker /workspace/worker
COPY --from=builder /workspace/ship/wrangler.toml /workspace/ship/wrangler.toml

RUN mkdir -p /workspace/ship
RUN cp -r /workspace/web/* /workspace/ship
RUN cp /workspace/worker/main.js /workspace/ship/worker.js
