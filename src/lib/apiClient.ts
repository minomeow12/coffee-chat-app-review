import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://pretorial-portliest-vertie.ngrok-free.dev",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const SERVER_URL = "https://pretorial-portliest-vertie.ngrok-free.dev";
