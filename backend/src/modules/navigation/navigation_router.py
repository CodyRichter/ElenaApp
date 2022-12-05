from fastapi import APIRouter
from src.models.Navigation import NavigationRequest, NavigationResponse
from src.modules.pathfinding import a_star

navigation_router = APIRouter()

@navigation_router.post("/path", response_model=NavigationResponse, status_code=200)
async def get_nav_route(nav_req: NavigationRequest):
    route_data, distance = a_star.a_star(nav_req.origin, nav_req.destination, nav_req.mode, nav_req.max_distance)
    nav_res = NavigationResponse(
        origin=nav_req.origin,
        destination=nav_req.destination,
        waypoints=route_data,
        distance=distance
        )
    return nav_res