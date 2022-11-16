from src.modules.database.database_client import create_user_db, get_user_db
import pytest
from fastapi.testclient import TestClient

from src.models.Exceptions import CredentialException
from src.app import app
from src.models.Users import UserInternal
from src.modules.auth.auth_utils import get_current_user

client = TestClient(app)

test_user = UserInternal(
    email="test@email.com",
    full_name="Test User",
    hashed_password="hashed_password",
    disabled=False,
)


def _raise(exception):
    raise exception


@pytest.fixture
def authenticated():
    app.dependency_overrides[get_current_user] = lambda: test_user


@pytest.fixture
def unauthenticated():
    app.dependency_overrides[get_current_user] = lambda: _raise(CredentialException)


@pytest.mark.timeout(5)
def test_profile_logged_in(authenticated):
    response = client.get("/auth/profile")
    assert response.status_code == 200


@pytest.mark.timeout(5)
def test_profile_logged_out(unauthenticated):
    response = client.get("/auth/profile")
    assert response.status_code == 401


@pytest.mark.timeout(5)
def test_signup_good_credentials(mocker):
    mocker.patch("src.modules.auth.auth_router.get_user_db", return_value=None)
    mocker.patch("src.modules.auth.auth_router.create_user_db", return_value=test_user)
    test_credentials = {
        "email": "test@email.com",
        "full_name": "Test User",
        "password": "testpass",
    }
    response = client.post("/auth/register", json=test_credentials)
    assert response.status_code == 201


@pytest.mark.timeout(5)
def test_signup_existing_account(mocker):
    mocker.patch("src.modules.auth.auth_router.get_user_db", return_value=test_user)
    test_credentials = {
        "email": "test@email.com",
        "full_name": "Test User",
        "password": "testpass",
    }
    err = client.post("/auth/register", json=test_credentials)
    assert err.status_code == 400


@pytest.mark.timeout(5)
def test_login_good_credentials(mocker):
    mocker.patch(
        "src.modules.auth.auth_router.authenticate_user", return_value=test_user
    )
    response = client.post("/auth/login", data={"username": "test", "password": "test"})
    assert response.status_code == 200


@pytest.mark.timeout(5)
def test_login_bad_credentials(mocker):
    mocker.patch("src.modules.auth.auth_router.authenticate_user", return_value=None)
    response = client.post("/auth/login", data={"username": "test", "password": "test"})
    assert response.status_code == 401
