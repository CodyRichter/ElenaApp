from fastapi import APIRouter

auth_router = APIRouter()


@auth_router.get(
    "/mock_endpoint",
)
def test_endpoint():
    return {"detail": "Auth Endpoint Hit."}
