import pytest
from fastapi.testclient import TestClient
from src.app import app
from src.models.Navigation import *

client = TestClient(app)

@pytest.mark.timeout(10)
def test_nav_route():
    req = NavigationRequest(
        origin = (42.37506,-72.52145),#amherst cinema to a little past the clark house
        destination = (42.37649, -72.51724),
        mode = "direct",
        max_distance = 10
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200