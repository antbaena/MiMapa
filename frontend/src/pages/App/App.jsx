import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "../Login/LoginPage";
import "./App.css";
import HomePage from "../Home/HomePage";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CreateLocationPage from "../Chincheta/CreateLocationPage";
import VisitUserPage from "../Home/VisitUserPage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="*" element={<LoginPage />} />

          <Route
            path="/mapa/:email"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />

          <Route
            path="/create-location"
            element={
              <Layout>
                <CreateLocationPage />
              </Layout>
            }
          />
          <Route
            path="/visit/:email"
            element={
              <Layout>
                <VisitUserPage />
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

// Componente Layout para envolver Header y Footer
const Layout = ({ children }) => (
  <>
    <Header />
    <div className="content">{children}</div>
    <Footer />
  </>
);

export default App;
