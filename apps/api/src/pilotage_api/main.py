from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pilotage_api.demo import router as demo_router
from pilotage_api.forecasts import router as forecast_router
from pilotage_api.health import HealthResponse
from pilotage_api.recommendations.routes import router as recommendation_router
from pilotage_api.settings import get_settings

app = FastAPI(
    title="Pilotage prédictif des restaurants",
    description="API locale utilisant uniquement des données fictives.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.include_router(demo_router)
app.include_router(forecast_router)
app.include_router(recommendation_router)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(version=settings.app_version, environment=settings.app_env)
