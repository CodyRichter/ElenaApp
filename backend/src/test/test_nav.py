import pytest
from fastapi.testclient import TestClient
from haversine import haversine
from src.app import app
from src.models.Navigation import *

client = TestClient(app)


@pytest.mark.timeout(10)
def test_nav_direct_route_named():
    req = NavigationRequest(
        origin = "Fine Arts Center, Amherst",
        destination = "Pokeberry Ridge, Amherst",
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
        print(pt)
    assert acc >= haversine(json["waypoints"][0], json["waypoints"][-1])#lower bounded by straight line

@pytest.mark.timeout(20)
def test_nav_min_route_named():
    req = NavigationRequest(
        origin = "Fine Arts Center, Amherst",
        destination = "Pokeberry Ridge, Amherst",
        mode = "minimize_elevation",
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
    assert acc >= haversine(json["waypoints"][0], json["waypoints"][-1])#lower bounded by straight line)
    #print(acc)
    assert acc > 0.997 #hardcoded FAC->Pokeberry, min elev route should do some roundabout way of getting there

@pytest.mark.timeout(20)
def test_nav_max_route_named():
    req = NavigationRequest(
        origin = "Fine Arts Center, Amherst",
        destination = "Pokeberry Ridge, Amherst",
        mode = "maximize_elevation",
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
    assert acc >= haversine(json["waypoints"][0], json["waypoints"][-1])#lower bounded by straight line)
    #print(acc)
    assert acc > 0.997 #hardcoded FAC->Pokeberry, max elev route should do some roundabout way of getting there
    assert abs(acc - 1.59) > 0.1 #hardcoded res of min route. min route could be wrong too, but max and min routes should not be the same
