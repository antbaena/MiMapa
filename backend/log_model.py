from pydantic import BaseModel, Field
from datetime import datetime


class Log(BaseModel):
    id :  str = Field(default=None, example="000000000000000000000000")
    uid: str = Field(default=None, example="000000000000000000000000")
    emailVisitante: str = Field(default=None, example="example@emai.com")
    emailPropietario: str = Field(default=None, example="example@emai.com")
    visitTime: datetime = Field(default=None, example="2021-01-01T00:00:00.000Z")


class LogCreate(BaseModel):
    uid: str = Field(default=None, example="000000000000000000000000", validate_default=True)
    emailVisitante: str  = Field(default=None, example="example@emai.com")
    emailPropietario:  str = Field(default=None, example="example@emai.com")
    visitTime: datetime = Field(default=None, example="2021-01-01T00:00:00.000Z")

