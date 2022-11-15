from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

from src.models.Exceptions import CredentialException
from src.modules.auth.auth_router import auth_router
from src.modules.navigation import navigation_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
)


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["auth"],
    responses={404: {"detail": "Not found"}},
)


app.include_router(
    navigation_router,
    prefix="/nav",
    tags=["navigation"],
    responses={404: {"detail": "Not found"}},
)


@app.on_event("startup")
def application_startup():
    # db = next(get_db())  # Get db instance from generator
    # TODO: Make Mongo DB Connection Here
    pass


@app.get("/")
async def root():
    return {"detail": "EleNa Backend is Running!"}


@app.exception_handler(CredentialException)
async def credential_exception_handler(request: Request, exc: CredentialException):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Unable to fulfill request. Invalid credentials."},
    )
