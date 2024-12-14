import React, { useState, useEffect } from "react";
import { useAPI } from "../../contexts/APIContext";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "./Components/MapComponentStatic";
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const { chinchetas, logs } = useAPI();
  const { isLogged, getUserData } = useAuth();
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [email, setEmail] = useState("");
  const [visits, setVisits] = useState([]);
  const { email: pageEmail } = useParams(); // Obtén email dinámicamente de los parámetros de la URL
  const navigate = useNavigate();
  const [logCreated, setLogCreated] = useState(false);

  useEffect(() => {
    if (!isLogged()) {
      navigate("/login");
      return;
    }

    const fetchLocationsAndLogs = async () => {
      try {
        const chinchetaList = await chinchetas.getByEmail(pageEmail);

        if (chinchetaList.data.length !== 0) {
          const userData = getUserData();
          if (userData && !logCreated) {
            const log_payload = {
              uid: userData.uid,
              emailVisitante: userData.email,
              emailPropietario: pageEmail,
              visitTime: new Date().toISOString(),
            };
            //comporbar que no hay nada null
            if (
              log_payload.uid &&
              log_payload.emailVisitante &&
              log_payload.emailPropietario
            ) {
              await logs.create(log_payload);
              setLogCreated(true);
            }
          }

          const locations = chinchetaList.data.map((chincheta) => ({
            lat: chincheta.lat,
            lon: chincheta.lon,
            imagenURI: chincheta.imagenURI,
            lugar: chincheta.lugar,
          }));
          setLocations(locations);
          setImages(chinchetaList.data.map((chincheta) => chincheta.imagenURI));
        }

        const visitLogs = await logs.getByPropietarioEmail(pageEmail);

        if (visitLogs.data) {
          const sortedVisits = visitLogs.data.sort(
            (a, b) => new Date(b.visitTime) - new Date(a.visitTime)
          );
          setVisits(sortedVisits);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLocationsAndLogs();
  }, [
    isLogged,
    pageEmail,
    chinchetas,
    logs,
    navigate,
    getUserData,
    logCreated,
  ]);
  const handleVisitUser = () => {
    if (email) {
      navigate(`/mapa/${email}`); // Cambia la ruta dinámica
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

      <div className="mt-4">
        <h2 className="text-center">Visitas Recibidas</h2>
        <ul className="list-group">
          {visits.map((visit, index) => (
            <li key={index} className="list-group-item">
              <strong>Fecha y Hora:</strong>{" "}
              {new Date(visit.visitTime).toLocaleString()}
              <br />
              <strong>Email del Visitante:</strong> {visit.emailVisitante}
              <br />
              <strong>Token OAuth:</strong> {visit.uid}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
