
import os
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from db_connection import DatabaseConnection
from media_endpoints import router as media_endpoints
from log_endpoints import router as log_endpoints
from chincheta_endpoints import router as chincheta_endpoints
load_dotenv()

@asynccontextmanager
async def lifespan(app):
    DatabaseConnection.connect()
    yield

    DatabaseConnection.close_connection()
    print("Conexión a la base de datos cerrada.")

app = FastAPI(lifespan=lifespan)
app.title = "Examen 3 API"
app.version = "1.0.0"
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media_endpoints, prefix="/api/v1")
app.include_router(log_endpoints, prefix="/api/v1")
app.include_router(chincheta_endpoints, prefix="/api/v1")

