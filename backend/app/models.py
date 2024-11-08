# app/models.py
from pydantic import BaseModel
from typing import List, Optional

class SolarFlare(BaseModel):
    time_tag: str
    flux: float
    energy: str
    classification: Optional[str]

class GeomagneticData(BaseModel):
    time_tag: str
    kp_index: float
    storm_level: Optional[str]

class SolarEventData(BaseModel):
    flares: List[SolarFlare]
    geomagnetic: List[GeomagneticData]
    last_updated: str
    alerts: List[str]