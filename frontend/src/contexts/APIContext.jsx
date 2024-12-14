import { createContext, useContext } from "react";
import axios from "axios";
import { use } from "react";

const APIContext = createContext();
const name = "localhost:8000";
const BASE_URL = import.meta.env.VITE_API_URL || `http://localhost:8000/api`;

export const APIProvider = ({ children }) => {
  const requestHandler = async (method, url, data = undefined) => {
    console.log(`${method.toUpperCase()}: ${url}`);
    if (data) console.log("Body", data);

    try {
      const response = await axios({ method, url, data });

      return response;
    } catch (error) {
      console.log(error.response);

      return error.response;
    }
  };

  const apiMethods = {
    get: (url) => requestHandler("get", url),
    post: (url, data) => requestHandler("post", url, data),
    put: (url, data) => requestHandler("put", url, data),
    delete: (url) => requestHandler("delete", url),
  };

  // Poner fijas las versiones, no que cada endpoint puede llamarse en una versión u otra
  const createEndpointMethods = (entity, extraEndpoints) => ({
    getAll: (params = "", version = "v1") =>
      apiMethods.get(`${BASE_URL}/${version}/${entity}${params}`),
    getById: (id, params = "", version = "v1") =>
      apiMethods.get(`${BASE_URL}/${version}/${entity}/${id}${params}`),
    create: (body, version = "v1") =>
      apiMethods.post(`${BASE_URL}/${version}/${entity}`, body),
    update: (id, body, version = "v1") =>
      apiMethods.put(`${BASE_URL}/${version}/${entity}/${id}`, body),
    delete: (id, version = "v1") =>
      apiMethods.delete(`${BASE_URL}/${version}/${entity}/${id}`),
    ...extraEndpoints,
  });

  const mediaAPI = {
    upload: (file) => apiMethods.post(`${BASE_URL}/v1/media`, file),
  };

  const chinchetasAPI = createEndpointMethods("chinchetas", {
    getByEmail: (email) =>
      apiMethods.get(`${BASE_URL}/v1/chinchetas?creadorEmail=${email}`),
  });

  const logsAPI = createEndpointMethods("logs", {
    getByPropietarioEmail: (email) =>
      apiMethods.get(`${BASE_URL}/v1/logs?emailPropietario=${email}`),
  });

  return (
    <APIContext.Provider
      value={{
        chinchetas: chinchetasAPI,
        media: mediaAPI,
        logs: logsAPI,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export const useAPI = () => {
  const context = useContext(APIContext);

  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }

  return context;
};
