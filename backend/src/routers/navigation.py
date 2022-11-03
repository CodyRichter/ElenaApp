from fastapi import APIRouter

navigation_router = APIRouter()


@navigation_router.get(
    "/mock_endpoint",
)
def test_endpoint():
    return {"detail": "Navigation Endpoint Hit.."}
