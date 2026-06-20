import { jwtDecode } from "jwt-decode";
import http from "../services/httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = `${apiUrl}/auth`;
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const { data: jwt } = await http.post(apiEndpoint, { email, password });
  loginWithJwt(jwt);
}

export async function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  try {
    const token = localStorage.getItem(tokenKey);
    const user = jwtDecode(token);
    return user;
  } catch (err) {
    console.log("error get user ", err);
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};
