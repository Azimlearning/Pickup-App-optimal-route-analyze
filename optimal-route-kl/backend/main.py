from typing import List, Optional
from fastapi import FastAPI, HTTPExceptionrom pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Optimal Route Mock API")

# Allow CORS for local dev and deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OptimizeRequest(BaseModel):
    locations: List[str]  # address strings or "lat,lng"


class Coordinate(BaseModel):
    lat: float
    lng: float


class RoutePoint(BaseModel):
    input: str
    coord: Coordinate


class OptimizeResponse(BaseModel):
    route: List[RoutePoint]
    summary: Optional[str] = None


def parse_location(loc: str) -> Coordinate:
    """
    Very small helper: if input is "lat,lng" parse it.
    For other strings, generate a deterministic fake coordinate for mocking.
    """
    try:
        if "," in loc:
            parts = loc.split(",")
            lat = float(parts[0].strip())
            lng = float(parts[1].strip())
            return Coordinate(lat=lat, lng=lng)
    except Exception:
        pass

    # Mock deterministic coords based on hash of string (keeps results stable for testing)
    h = abs(hash(loc))
    lat = 1.0 + (h % 9000) / 1000.0  # example pseudo-lat
    lng = 101.0 + (h % 18000) / 1000.0  # example pseudo-lng
    return Coordinate(lat=lat, lng=lng)


@app.post("/optimize", response_model=OptimizeResponse)
async def optimize(req: OptimizeRequest):
    if not req.locations or len(req.locations) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two locations")
    points = [RoutePoint(input=loc, coord=parse_location(loc)) for loc in req.locations]

    # Very simple mock "optimization": keep order as-is but mark as route
    return OptimizeResponse(route=points, summary=f"Mock route for {len(points)} points")