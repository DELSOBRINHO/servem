from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .api import auth, events, volunteers, gamification, recommendations, prediction

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(events.router, prefix=f"{settings.API_V1_STR}/events", tags=["events"])
app.include_router(volunteers.router, prefix=f"{settings.API_V1_STR}/volunteers", tags=["volunteers"])
app.include_router(gamification.router, prefix=f"{settings.API_V1_STR}/gamification", tags=["gamification"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/recommendations", tags=["recommendations"])
app.include_router(prediction.router, prefix=f"{settings.API_V1_STR}/prediction", tags=["prediction"])

@app.get("/")
async def root():
    return {"message": "Welcome to ServeM API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)