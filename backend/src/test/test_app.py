from src.modules.database.database_client import create_user_db, get_user_db
import pytest
from fastapi.testclient import TestClient

from src.models.Exceptions import CredentialException
from src.app import app
from src.models.Users import UserInternal
from src.modules.auth.auth_utils import get_current_user

client = TestClient(app)


@pytest.mark.timeout(5)
def test_app_running():
    response = client.get("/")
    assert response.status_code == 200
