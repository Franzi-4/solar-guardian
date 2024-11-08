# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from datetime import datetime
from .models import SolarEventData, SolarFlare, GeomagneticData
from .config import settings

app = FastAPI(title=settings.APP_NAME)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def fetch_data(url: str, client: httpx.AsyncClient):
    try:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()
    except httpx.HTTPError as e:
        return None

def classify_flare(flux: float) -> str:
    if flux >= 1e-4: return "X"
    elif flux >= 1e-5: return "M"
    elif flux >= 1e-6: return "C"
    elif flux >= 1e-7: return "B"
    else: return "A"

@app.get("/")
async def root():
    return {"message": "Solar Guardian API is running"}

@app.get("/api/solar-data", response_model=SolarEventData)
async def get_solar_data():
    async with httpx.AsyncClient() as client:
        solar_data = await fetch_data(settings.API_ENDPOINTS['SOLAR_FLARE'], client)
        geo_data = await fetch_data(settings.API_ENDPOINTS['GEOMAGNETIC'], client)
        
        flares = []
        if solar_data:
            for entry in solar_data:
                flares.append(SolarFlare(
                    time_tag=entry['time_tag'],
                    flux=float(entry['flux']),
                    energy='0.1-0.8nm',
                    classification=classify_flare(float(entry['flux']))
                ))
        
        geomagnetic = []
        if geo_data:
            for entry in geo_data[1:]:  # Skip header
                try:
                    geomagnetic.append(GeomagneticData(
                        time_tag=entry[0],
                        kp_index=float(entry[1]),
                        storm_level="Normal"
                    ))
                except (ValueError, IndexError):
                    continue

        return SolarEventData(
            flares=flares,
            geomagnetic=geomagnetic,
            last_updated=datetime.utcnow().isoformat(),
            alerts=[]
        )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)