import osmnx as ox
from fastapi import APIRouter, Depends
from src.models.Navigation import (NavigationHistoryInstance,
                                   NavigationHistoryResponse,
                                   NavigationRequest, NavigationResponse)
from src.models.Users import UserInternal
from src.modules.auth.auth_utils import get_current_user
from src.modules.database.database_client import (get_navigation_history_db,
                                                  save_navigation_history_db)
from src.modules.pathfinding import a_star

navigation_router = APIRouter()


@navigation_router.post("/path", response_model=NavigationResponse, status_code=200)
async def get_nav_route(
    nav_req: NavigationRequest, current_user: UserInternal = Depends(get_current_user)
):
    """
    Get the navigation route from the origin to the destination.
    If a mode is specified, the route will be optimized for that mode.
    If a max distance is specified, the route will be optimized to be less than that distance.
    """
    # provide name -> coord resolution
    origin = ox.geocode(nav_req.origin)
    destination = ox.geocode(nav_req.destination)
    midpt = ((origin[0] + destination[0])/2, (origin[1] + destination[1])/2)
    strategy = a_star.getStrategy(nav_req.mode, nav_req.max_distance, midpt)
    a_star.a_star_router.routing_strategy = strategy

    route_data, distance = a_star.a_star_router.get_route(origin, destination)
    nav_res = NavigationResponse(
        origin_name=nav_req.origin,
        destination_name=nav_req.destination,
        origin=origin,
        destination=destination,
        waypoints=route_data,
        distance=distance,
    )

    save_navigation_history_db(
        NavigationHistoryInstance(**nav_res.dict(), email=current_user.email)
    )

    return nav_res


@navigation_router.get(
    "/history", response_model=NavigationHistoryResponse, status_code=200
)
async def get_nav_history(current_user: UserInternal = Depends(get_current_user)):
    """
    Get the navigation history of the user.
    """

    user_navigation_history = get_navigation_history_db(current_user.email)
    return NavigationHistoryResponse(history=user_navigation_history)
