from pydantic import BaseModel, Field
from datetime import datetime

class Chincheta(BaseModel):
    id :  str = Field(default=None, example="000000000000000000000000")
    creadorEmail: str = Field(default=None, example="email@email.com")
    lugar: str = Field(default=None, example="Madrid")
    lat: float = Field(default=None, example=40.4168)
    lon: float = Field(default=None, example=-3.7038)
    imagenURI: str = Field(default=None, example="https://cloudinary.com/image/madrid.jpg")
    fecha_creacion: datetime = Field(default=None, example="2024-12-13T12:00:00Z")

class ChinchetaCreate(BaseModel):
    creadorEmail: str = Field(default=None, example="ant@uma.es")
    lugar: str = Field(default=None, example="Malaga")
    lat: float = Field(default=None, example=36.719648)
    lon: float = Field(default=None, example=-4.420016)
    imagenURI: str = Field(default=None, example="https://cloudinary.com/image/malaga.jpg")
    fecha_creacion: datetime = Field(default=None, example="2024-12-13T12:00:00Z")

                              
