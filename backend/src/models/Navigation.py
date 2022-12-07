from enum import Enum
from typing import List, Tuple, Union

from pydantic import BaseModel


class NavigationMode(Enum):
    MINIMIZE = "minimize_elevation"
    DIRECT = "direct"
    MAXIMIZE = "maximize_elevation"


class NavigationRequest(BaseModel):
    origin: str  # Placename
    destination: str  # Placename
    mode: str  # TODO: Figure out how to make this NavigationMode type without breaking the /nav/path route
    max_distance: int


class NavigationResponse(BaseModel):
    origin_name: str  # Placename
    destination_name: str  # Placename
    origin: Tuple[float, float]  # Lat, Lon
    destination: Tuple[float, float]  # Lat, Lon
    waypoints: List[
        Tuple[float, float]
    ]  # Ordered list of (Lat, Lon) pairings showing each discrete waypoint
    distance: float  # Total distance


class NavigationHistoryResponse(BaseModel):
    history: List[NavigationResponse]
