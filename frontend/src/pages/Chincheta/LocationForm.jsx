import React, { useState } from "react";

const LocationForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imagen: file,
      });
    }
  };

  const handleSearchAddress = async () => {
    if (searchInput.trim()) {
      try {
        setLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchInput
          )}`
        );
        const data = await response.json();
        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];
          setFormData({
            ...formData,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            lugar: display_name,
          });
          setShowModal(false);
        } else {
          alert("No results found for the entered address.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("An error occurred while searching for the address.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter an address to search.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h1 className="text-center">Introduce los datos de la chincheta</h1>
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Creador
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-control"
            required
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lugar" className="form-label">
            Lugar
          </label>
          <input
            type="text"
            id="lugar"
            name="lugar"
            value={formData.lugar}
            onChange={handleInputChange}
            className="form-control"
            required
            disabled
          />
        </div>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="lat" className="form-label">
              Latitud
            </label>
            <input
              type="number"
              id="lat"
              name="lat"
              value={formData.lat}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled
            />
          </div>
          <div className="col">
            <label htmlFor="lon" className="form-label">
              Longitud
            </label>
            <input
              type="number"
              id="lon"
              name="lon"
              value={formData.lon}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled
            />
          </div>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowModal(true)}
          >
            Buscar Dirección
          </button>
        </div>

        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">
            Imagen del sitio
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
            required={!formData.imagen}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {formData.id ? "Actualizar Evento" : "Crear Chincheta"}
        </button>
        {showModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Buscar Dirección</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Introduce una dirección"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSearchAddress}
                    disabled={loading}
                  >
                    {loading ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default LocationForm;
