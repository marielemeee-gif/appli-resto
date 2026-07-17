FROM node:24-slim AS web-builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN pnpm install --frozen-lockfile

COPY apps/web apps/web
ENV NEXT_PUBLIC_API_URL=""
RUN pnpm build:web

FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ENV=production \
    DEMO_MODE=true

WORKDIR /app
COPY apps/api apps/api
COPY data/config data/config
COPY --from=web-builder /app/apps/web/out apps/web/out

RUN python -m pip install --no-cache-dir -e apps/api && \
    python -m pilotage_api.simulation.generator --scenario all && \
    python -m pilotage_api.forecasting.backtest --scenario all

EXPOSE 10000
CMD ["sh", "-c", "uvicorn pilotage_api.main:app --app-dir apps/api/src --host 0.0.0.0 --port ${PORT:-10000}"]
