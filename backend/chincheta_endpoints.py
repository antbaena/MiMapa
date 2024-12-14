import httpx

from typing import List
from fastapi import APIRouter, HTTPException, Query, Request, Path
from fastapi.responses import JSONResponse

from chincheta_model import Chincheta, ChinchetaCreate
from db_connection import DatabaseConnection
from api_utils import APIUtils
from fastapi import Path, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

client = httpx.AsyncClient()

endpoint_name = "chinchetas"
version = "v1"

@router.get("/" + endpoint_name, tags=["chincheta CRUD endpoints"], response_model=List[Chincheta])
async def get_chinchetas(
    request: Request,
    creadorEmail: str | None = Query(None, description="Email del creador"),
    lugar: str | None = Query(None, description="Lugar de la chincheta"),
    lat: float | None = Query(None, description="Latitud de la chincheta"),
    lon: float | None = Query(None, description="Longitud de la chincheta"),
    fields: str | None = Query(None, description="Campos específicos a devolver"),
    sort: str | None = Query(None, description="Campos por los que ordenar, separados por comas"),
    offset: int = Query(default=0, description="Índice de inicio para los resultados de la paginación"),
    limit: int = Query(default=10, description="Cantidad de chinchetas a devolver, por defecto 10"),
    hateoas: bool | None = Query(None, description="Incluir enlaces HATEOAS")
):
    APIUtils.check_accept_json(request)

    try:
        projection = APIUtils.build_projection(fields)
        sort_criteria = APIUtils.build_sort_criteria(sort)

        query = {}
        if creadorEmail is not None:
            query["creadorEmail"] = creadorEmail
        if lugar is not None:
            query["lugar"] = lugar
        if lat is not None:
            query["lat"] = lat
        if lon is not None:
            query["lon"] = lon

        chinchetas = DatabaseConnection.query_document("chincheta", query, projection, sort_criteria, offset, limit)

        if hateoas:
            for chincheta in chinchetas:
                chincheta["links"] = APIUtils.build_hateoas_links(request, endpoint_name, chincheta["id"])

        return JSONResponse(content=chinchetas, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/" + endpoint_name + "/{chincheta_id}", tags=["chincheta CRUD endpoints"], response_model=Chincheta)
async def get_chincheta_by_id(
    request: Request,
    chincheta_id: str | None = Path( description="ID de la chincheta")
):
    APIUtils.check_accept_json(request)

    try:
        chincheta = DatabaseConnection.read_document("chincheta", chincheta_id)

        return JSONResponse(content=chincheta, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/" + endpoint_name, tags=["chincheta CRUD endpoints"], response_model=Chincheta)
async def create_chincheta(
    request: Request,
    chincheta: ChinchetaCreate
):
    APIUtils.check_accept_json(request)
    
    try:
        chincheta_dict = chincheta.model_dump()
        chincheta_id = DatabaseConnection.create_document("chincheta", chincheta_dict)

        return JSONResponse(status_code=201, content={"detail": "La chincheta se ha creado correctamente", "result": chincheta_dict} )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))