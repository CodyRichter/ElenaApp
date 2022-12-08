import osmnx as ox
from fastapi import APIRouter
from src.models.Navigation import (
    NavigationRequest,
    NavigationResponse,
    NavigationHistoryResponse,
)
from src.modules.pathfinding import a_star

navigation_router = APIRouter()


@navigation_router.post("/path", response_model=NavigationResponse, status_code=200)
async def get_nav_route(nav_req: NavigationRequest):
    # provide name -> coord resolution
    origin = ox.geocode(nav_req.origin)
    destination = ox.geocode(nav_req.destination)
    route_data, distance = a_star.a_star(
        origin, destination, nav_req.mode, nav_req.max_distance
    )
    nav_res = NavigationResponse(
        origin_name=nav_req.origin,
        destination_name=nav_req.destination,
        origin=origin,
        destination=destination,
        waypoints=route_data,
        distance=distance,
    )
    return nav_res


@navigation_router.get(
    "/history", response_model=NavigationHistoryResponse, status_code=200
)
async def get_nav_history():

    # TODO: Query Database for User's Navigation History
    # TODO: Store the Navigation History in the Database
    # TODO: Store names instead of GPS coordinates for the origin and destination
    return NavigationHistoryResponse(
        history=[
            NavigationResponse(
                origin_name="Origin",
                destination_name="Destination",
                origin=(0, 0),
                destination=(10, 10),
                waypoints=[(0, 0), (10, 10)],
                distance=10,
            )
        ]
    )
