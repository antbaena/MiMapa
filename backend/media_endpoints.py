import os

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

load_dotenv()

cloudinary.config( 
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
router = APIRouter()

endpoint_name = "media"
version = "v1"

@router.post("/" + endpoint_name, tags=["Image Upload endpoint"])
async def upload_image(file: UploadFile = File(...)):
    try:
        # Asegúrate de que el archivo sea procesable por Cloudinary
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=422, detail="El archivo debe ser una imagen.")

        # Cargar la imagen a Cloudinary
        upload_result = cloudinary.uploader.upload(file.file, resource_type="image")
        thumbnail_url = upload_result.get('secure_url')

        if not thumbnail_url:
            raise HTTPException(status_code=500, detail="No se pudo obtener la URL de la imagen.")

        return JSONResponse(status_code=201, content={
            "detail": "La imagen se ha subido correctamente",
            "result": thumbnail_url
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir la imagen: {str(e)}")

    """Construir una consulta a partir de los parámetros proporcionados."""
    query = {}

    if ownerId is not None:
        query["ownerId"] = ownerId

    if name is not None:
        query["name"] = name

    return query