# app/config.py
from pydantic_settings import BaseSettings
from typing import Dict, Optional

class Settings(BaseSettings):
    APP_NAME: str = "Solar Guardian"
    DEBUG: bool = True
    API_ENDPOINTS: Dict[str, str] = {
        'NOAA_SPACE_WEATHER': 'https://services.swpc.noaa.gov/json/goes/primary',
        'SOLAR_FLARE': 'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json',
        'GEOMAGNETIC': 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
        'CME': 'https://services.swpc.noaa.gov/products/animations/cme.json'
    }
    CACHE_DURATION: int = 300  # 5 minutes

    class Config:
        env_file = ".env"

settings = Settings()