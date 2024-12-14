import httpx

from typing import List
from fastapi import APIRouter, HTTPException, Query, Request, Path
from fastapi.responses import JSONResponse

from log_model import Log, LogCreate
from db_connection import DatabaseConnection
from api_utils import APIUtils
from fastapi import Path, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime

router = APIRouter()

client = httpx.AsyncClient()

endpoint_name = "logs"
version = "v1"
#  id :  str = Field(default=None, example="000000000000000000000000")
#     uid: str = Field(default=None, example="000000000000000000000000")
#     emailVisitante: str = Field(default=None, example="example@emai.com")
#     emailPropietario: str = Field(default=None, example="example@emai.com")
#     visitTime: datetime = Field(default=None, example="2021-01-01T00:00:00.000Z")


@router.get("/" + endpoint_name, tags=["log CRUD endpoints"], response_model=List[Log])
async def get_logs(request: Request,
                    uid: str = Query(None, description="User ID", example="000000000000000000000000"),
                    emailVisitante: str = Query(None, description="Visitor email", example="example@emai.com"),
                    emailPropietario: str = Query(None, description="Owner email", example="example@emai.com"),
                    visitTime: datetime = Query(None, description="Visit time", example="2021-01-01T00:00:00.000Z")):
    APIUtils.check_accept_json(request)

    try:
        query = {}
        if uid is not None:
            query["uid"] = uid
        if emailVisitante is not None:
            query["emailVisitante"] = emailVisitante
        if emailPropietario is not None:
            query["emailPropietario"] = emailPropietario
        if visitTime is not None:
            query["visitTime"] = visitTime

        logs = DatabaseConnection.query_document("log", query)

        return JSONResponse(content=logs, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#create
@router.post("/" + endpoint_name, tags=["log CRUD endpoints"], response_model=Log)
async def create_log(request: Request, log: LogCreate):
    APIUtils.check_accept_json(request)

    try:
        log_dict = log.model_dump()
        log = DatabaseConnection.create_document("log", log_dict)

        return JSONResponse(status_code=201, content={"detail": "Log se ha creado correctamente", "result": log_dict} )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))