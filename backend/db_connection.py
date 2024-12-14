from datetime import datetime
from typing import List
from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import logging
import os
from dotenv import load_dotenv

# Configuración del registro de errores
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
load_dotenv()

class DatabaseConnection:
    """
    DatabaseConnection es una clase que maneja la conexión a una base de datos MongoDB y proporciona métodos para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en las colecciones de la base de datos.
    Métodos de Clase:
    - connect(cls): Establece la conexión a la base de datos.
    - get_collection(cls, collection_name): Obtiene una colección específica de la base de datos.
    - create_document(cls, collection_name, document): Crea un nuevo documento en la colección especificada.
    - read_document(cls, collection_name, document_id): Lee un documento por su ID.
    - update_document(cls, collection_name, document_id, updated_fields): Actualiza un documento existente con los campos proporcionados.
    - delete_document(cls, collection_name, document_id): Elimina un documento por su ID.
    - close_connection(cls): Cierra la conexión a la base de datos.
    Atributos de Clase:
    - _client: Instancia del cliente MongoDB.
    - _db: Instancia de la base de datos MongoDB.
    Excepciones:
    - errors.ConnectionError: Se lanza si hay un error al establecer la conexión a la base de datos.
    - errors.PyMongoError: Se lanza si hay un error al realizar operaciones CRUD.
    - errors.InvalidId: Se lanza si el ID del documento no es válido.
    """

    _client = None
    _db = None

    @classmethod
    def connect(cls):
        """
        Establish a connection to the database.

        This method initializes a MongoDB client using the provided URI and
        certificate key file. If the connection is successful, it sets the
        client and database attributes for the class. If the connection fails,
        it logs an error message and raises a ConnectionError.

        Raises:
            errors.ConnectionError: If there is an error connecting to the database.
        """
        """Establecer la conexión a la base de datos."""
        if cls._client is None:
            try:
                uri = os.getenv('URI')
                cls._client = MongoClient(uri,server_api=ServerApi('1'))
                cls._db = cls._client['MiMapa'] # Cambiar por el nombre de la base de datos
                logger.info("Conexión establecida a la base de datos.")
            except errors.ConnectionFailure as e:
                logger.error(f"Error de conexión a la base de datos: {e}")
                raise

    @classmethod
    def get_collection(cls, collection_name):
        """Obtener una colección específica de la base de datos."""
        cls.connect()
        return cls._db[collection_name]
    
    @classmethod
    def create_document(cls, collection_name, document):
        """Crear un nuevo documento en la colección."""
        collection = cls.get_collection(collection_name)
        try:
            result = collection.insert_one(document)
            DatabaseConnection.stringfy_document(document)
            logger.info(f"Documento creado con ID: {result.inserted_id}")
            return document['_id']
        except errors.PyMongoError as e:
            logger.error(f"Error al crear el documento: {e}")
            raise

    @classmethod
    def read_document(cls, collection_name, document_id : str, projection = None):
        """Leer un documento por su ID."""
        collection = cls.get_collection(collection_name)
        try:
            document = collection.find_one({"_id": ObjectId(document_id)}, projection)
            if document is None:
                logger.warning(f"Documento con ID {document_id} no encontrado.")
            else:
                DatabaseConnection.stringfy_document(document)
            return document
        except errors.InvalidId as e:
            logger.error(f"ID de documento no válido: {e}")
            raise
    
    @classmethod
    def query_document(cls, collection_name, document_query, projection = None, sort_criteria = None, skip = 0, limit = 0, id_list=None):
        """Realizar query según los parámetros."""
        collection = cls.get_collection(collection_name)
        try:
            if id_list:
                document_query['_id'] = {"$in": id_list}

            documents = collection.find(document_query, projection)

            if sort_criteria:
                documents = documents.sort(sort_criteria)
            if limit > 0:
                documents.limit(limit)
            if skip > 0:
                documents.skip(skip)

            if documents is None:
                logger.warning(f"Wiki con {document_query} no encontrada.")
                return []


            return DatabaseConnection.stringfy_documents(documents)
        except Exception as e:
            logger.error(f"Error al realizar la consulta: {e}")
            raise

    @classmethod
    def update_document(cls, collection_name, document_id, updated_fields):
        """Actualizar un documento existente y devolver el documento actualizado."""
        collection = cls.get_collection(collection_name)
        try:
            updated_document = collection.find_one_and_update(
                {"_id": ObjectId(document_id)},
                {"$set": updated_fields},
                return_document=True 
            )
            
            if updated_document is None:
                logger.warning(f"No se encontró el documento con ID {document_id} para actualizar.")
            else:
                DatabaseConnection.stringfy_document(updated_document)
                logger.info(f"Documento con ID {document_id} actualizado.")

            return updated_document

        except errors.PyMongoError as e:
            logger.error(f"Error al actualizar el documento: {e}")
            raise

    @classmethod
    def delete_document(cls, collection_name, document_id):
        """Eliminar un documento por su ID."""
        collection = cls.get_collection(collection_name)
        try:
            result = collection.delete_one({"_id": ObjectId(document_id)})
            if result.deleted_count == 0:
                logger.warning(f"No se encontró el documento con ID {document_id} para eliminar.")
            else:
                logger.info(f"Documento con ID {document_id} eliminado.")
            return result.deleted_count
        except errors.InvalidId as e:
            logger.error(f"ID de documento no válido: {e}")
            raise

    @classmethod
    def close_connection(cls):
        """Cerrar la conexión a la base de datos."""
        if cls._client is not None:
            cls._client.close()
            cls._client = None
            cls._db = None
            logger.info("Conexión a la base de datos cerrada.")
    
    @classmethod
    def stringfy_document(self, document : dict):
        """
        Stringfy a MongoDB document, changing the object by reference.
        
            Parameters:
                document (dict): MongoDB Cursor
        """
        for k,v in document.items():
            if type(v) == ObjectId:
                document[k] = v.binary.hex()
            elif type(v) == datetime:
                document[k] = v.strftime("%Y-%m-%d %H:%M:%S")
            # can add more types if needed
    
    @classmethod
    def stringfy_documents(self, documents : any) -> List[dict]:
        """
        Stringfy various MongoDB documents.

            Parameters:
                documents (any): MongoDB Cursor
            
            Return:
                documents_list (List[dict]): List of documents strinfieds
        """
        l = documents.to_list()
        for d in l:
            DatabaseConnection.stringfy_document(d)
        
        return l

    @classmethod
    def is_valid_objectid(cls, id: str) -> bool:
        try:
            ObjectId(id)
            return True
        except Exception:
            return False
