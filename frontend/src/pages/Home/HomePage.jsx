import React, { useState, useEffect } from "react";
import { useAPI } from "../../contexts/APIContext";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "./Components/MapComponentStatic";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const { chinchetas } = useAPI();
  const { isLogged, getUserData } = useAuth();
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [email, setEmail] = useState("");
  const { email: pageEmail } = useParams(); // Obtén email dinámicamente de los parámetros de la URL
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged()) {
      navigate("/login");
    } else {
      const fetchLocations = async () => {
        try {
          const chinchetaList = await chinchetas.getByEmail(pageEmail);

          if (chinchetaList.data.length !== 0) {
            const locations = chinchetaList.data.map((chincheta) => ({
              lat: chincheta.lat,
              lon: chincheta.lon,
              imagenURI: chincheta.imagenURI,
              lugar: chincheta.lugar,
            }));
            setLocations(locations);
            setImages(
              chinchetaList.data.map((chincheta) => chincheta.imagenURI)
            );
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };
      fetchLocations();
    }
  }, [pageEmail]); // Escucha los cambios en pageEmail

  const handleVisitUser = () => {
    if (email) {
      navigate(`/visit/${email}`); // Cambia la ruta dinámica
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Mapa de Localizaciones</h1>
      <h2 className="text-center">Mapa de {pageEmail}</h2>
      <div className="card mb-4">
        <div className="card-body">
          <MapComponent
            markers={locations.map(({ lat, lon, imagenURI, lugar }) => [
              lat,
              lon,
              imagenURI,
              lugar,
            ])}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        {isLogged() && getUserData().email === pageEmail && (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/create-location")}
          >
            Añadir Localización
          </button>
        )}
      </div>
      <div className="d-flex justify-content-center mt-3">
        <input
          type="email"
          placeholder="Introduce el email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
        />
        <button className="btn btn-secondary" onClick={handleVisitUser}>
          Visitar Usuario
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-center">Imágenes de Localizaciones</h2>
        <div className="d-flex flex-wrap justify-content-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Imagen ${index + 1}`}
              className="img-thumbnail m-2"
              style={{ width: "200px", height: "150px", objectFit: "cover" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
