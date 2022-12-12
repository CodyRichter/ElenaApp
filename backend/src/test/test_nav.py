import pytest
from fastapi.testclient import TestClient
from haversine import haversine

from src.app import app
from src.models.Navigation import *
from src.models.Users import UserInternal
from src.modules.auth.auth_utils import get_current_user

client = TestClient(app)

test_user = UserInternal(
    email="test@email.com",
    full_name="Test User",
    hashed_password="hashed_password",
    disabled=False,
)


@pytest.fixture
def authenticated(mocker):
    mocker.patch(
        "src.modules.navigation.navigation_router.save_navigation_history_db",
        return_value=None,
    )
    mocker.patch(
        "src.modules.navigation.navigation_router.get_navigation_history_db",
        return_value=[],
    )
    app.dependency_overrides[get_current_user] = lambda: test_user


@pytest.mark.timeout(20)
def test_nav_direct_route_named(authenticated):
    req = NavigationRequest(
        origin="Fine Arts Center, Amherst",
        destination="Pokeberry Ridge, Amherst",
        mode="direct",
        max_distance=10,
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200
    json = response.json()
    assert len(json["waypoints"]) > 2  # path must be more than just start->finish

    prev = json["waypoints"][0]
    acc = 0
    for pt in json["waypoints"]:
        acc += haversine(pt, prev)
        prev = pt
    assert acc >= haversine(
        json["waypoints"][0], json["waypoints"][-1]
    )  # lower bounded by straight line
    assert (
        abs(acc - json["distance"]) < 0.1
    )  # distance returned is close to manually calc


@pytest.mark.timeout(20)
def test_nav_min_route_named(authenticated):
    req = NavigationRequest(
        origin="Fine Arts Center, Amherst",
        destination="Pokeberry Ridge, Amherst",
        mode="minimize_elevation",
        max_distance=10,
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200
    json = response.json()
    assert len(json["waypoints"]) > 2  # path must be more than just start->finish

    prev = json["waypoints"][0]
    acc = 0
    for pt in json["waypoints"]:
        acc += haversine(pt, prev)
        prev = pt
    assert acc >= haversine(
        json["waypoints"][0], json["waypoints"][-1]
    )  # lower bounded by straight line)
    assert (
        acc > 0.961
    )  # hardcoded FAC->Pokeberry, min elev route should do some roundabout way of getting there
    assert (
        abs(acc - json["distance"]) < 0.1
    )  # distance returned is close to manually calc


@pytest.mark.timeout(20)
def test_nav_max_route_named(authenticated):
    req = NavigationRequest(
        origin="Fine Arts Center, Amherst",
        destination="Pokeberry Ridge, Amherst",
        mode="maximize_elevation",
        max_distance=10,
    )
    response = client.post("/nav/path", json=req.dict())
    assert response.status_code == 200
    json = response.json()
    assert len(json["waypoints"]) > 2  # path must be more than just start->finish

    prev = json["waypoints"][0]
    acc = 0
    for pt in json["waypoints"]:
        acc += haversine(pt, prev)
        prev = pt
    assert acc >= haversine(
        json["waypoints"][0], json["waypoints"][-1]
    )  # lower bounded by straight line)
    assert (
        acc > 0.961
    )  # hardcoded FAC->Pokeberry, max elev route should do some roundabout way of getting there
    assert (
        abs(acc - json["distance"]) < 0.1
    )  # distance returned is close to manually calc


@pytest.mark.timeout(5)
def test_get_navigation_history(authenticated):
    response = client.get("/nav/history")
    assert response.status_code == 200
    json = response.json()
    assert "history" in json.keys()
    assert len(json["history"]) == 0
