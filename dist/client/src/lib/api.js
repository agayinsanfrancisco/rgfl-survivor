import axios from "axios";
const api = axios.create({
    baseURL: "/",
    withCredentials: true
});
export const AUTH_STORAGE_KEY = "rgfl_auth_token";
export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        if (typeof window !== "undefined") {
            window.localStorage.setItem(AUTH_STORAGE_KEY, token);
        }
    }
    else {
        delete api.defaults.headers.common.Authorization;
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }
}
if (typeof window !== "undefined") {
    const storedToken = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
}
export default api;
