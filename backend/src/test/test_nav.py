import pytest
from fastapi.testclient import TestClient
from haversine import haversine
from src.app import app
from src.models.Navigation import *

client = TestClient(app)

@pytest.mark.timeout(10)
def test_nav_direct_route():
    req = NavigationRequest(
        origin = (42.37506,-72.52145),#amherst cinema to a little past the clark house
        destination = (42.37649, -72.51724),
        mode = "direct",
        max_distance = 10
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200
    json = response.json()
    assert len(json["waypoints"]) > 2 #path must be more than just start->finish
    prev = json["waypoints"][0]
    acc = 0
    for pt in json["waypoints"]:
        acc += haversine(pt, prev)
        prev = pt
    assert acc >= haversine(json["waypoints"][0], json["waypoints"][-1])#lower bounded by straight line

@pytest.mark.timeout(10)
def test_nav_direct_route_named():
    req = NavigationRequest(
        origin = "Amherst Cinema",
        destination = "Beneski Museum of Natural History",
        mode = "direct",
        max_distance = 10
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200
    json = response.json()
    assert len(json["waypoints"]) > 2 #path must be more than just start->finish
    prev = json["waypoints"][0]
    acc = 0
    for pt in json["waypoints"]:
        acc += haversine(pt, prev)
        prev = pt
    assert acc >= haversine(json["waypoints"][0], json["waypoints"][-1])#lower bounded by straight line