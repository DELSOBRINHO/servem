import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "ServeM Backend"
    
    # Database settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Security settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    
    # ML model directory
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    
    class Config:
        env_file = ".env"

settings = Settings()