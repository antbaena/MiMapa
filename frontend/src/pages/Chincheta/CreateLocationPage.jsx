import React, { useState } from "react";
import { useAPI } from "../../contexts/APIContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LocationForm from "./LocationForm";

const CreateMapaPage = () => {
  const { chinchetas, media } = useAPI();
  const { getUserData } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateLocation = async (formData) => {
    setIsLoading(true); // Activa el loader
    try {
      const imageData = new FormData();
      if (formData.imagen) {
        imageData.append("file", formData.imagen);
        const response = await media.upload(imageData);
        const imageUrl = response.data.result;
        formData.imagenURI = imageUrl;
      }

      const newChincheta = {
        ...formData,
        creadorEmail: getUserData().email,
        fecha_creacion: new Date().toISOString(),
      };
      await chinchetas.create(newChincheta);
      navigate(-1);
    } catch (error) {
      console.error("Error creating location:", error);
      alert("Error al crear el location.");
    } finally {
      setIsLoading(false); // Desactiva el loader
    }
  };

  const initialData = {
    email: getUserData().email,
    lat: "",
    lon: "",
    lugar: "",
    imagen: null,
  };

  return (
    <div>
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-75">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      <LocationForm initialData={initialData} onSubmit={handleCreateLocation} />
    </div>
  );
};

export default CreateMapaPage;
