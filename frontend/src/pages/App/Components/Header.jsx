import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Header = () => {
  const { isLogged, getUserData } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          {isLogged() && (
            // ir a la pagina del user mapa/:email
            <Link className="navbar-brand" to={`/mapa/${getUserData().email}`}>
              MiMapa de {getUserData().email}
            </Link>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav"></div>
          </div>
          <button
            className={`btn btn-${isLogged() ? "danger" : "outline-primary"}`}
            onClick={handleLoginClick}
          >
            {isLogged() ? "Cerrar sesión" : "Iniciar sesión"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
