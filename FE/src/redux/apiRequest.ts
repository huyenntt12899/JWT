import { AnyAction, Dispatch } from "redux";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "./authSlice";
import axios, { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router-dom";
import { INewUser } from "../Components/Register/model";
import { IUserLogin } from "../Components/Login/model";
import {
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
} from "./userSlice";
export const API_URL = "http://localhost:8001/";

// Auth
export const loginUser = async (
  user: IUserLogin,
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) => {
  dispatch(loginStart());
  try {
    const res: any = await axios.post(`${API_URL}v1/auth/login`, user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (
  user: INewUser,
  dispatch: Dispatch<AnyAction>,
  navigate: NavigateFunction
) => {
  dispatch(registerStart());
  try {
    await axios.post(`${API_URL}v1/auth/register`, user);
    dispatch(registerSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(registerFailed());
  }
};

// User
export const getAllUsers = async (
  accessToken: string,
  dispatch: Dispatch<AnyAction>,
  axiosJWT: AxiosInstance
) => {
  dispatch(getUsersStart());
  try {
    const res = await axiosJWT.get(`${API_URL}v1/user`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    dispatch(getUsersFailed());
  }
};

export const deleteUser = async (
  id: string,
  accessToken: string,
  dispatch: Dispatch<AnyAction>,
  axiosJWT: AxiosInstance
) => {
  dispatch(deleteUserStart());
  try {
    const res = await axiosJWT.delete(`${API_URL}v1/user/${id}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    dispatch(deleteUserSuccess(res.data));
  } catch (error: any) {
    dispatch(deleteUserFailed(error.res.data));
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(`${API_URL}v1/auth/refresh`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
export const logout = async (
  id: string,
  navigate: NavigateFunction,
  accessToken: string,
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(logoutStart());
  try {
    await axios.post(`${API_URL}v1/auth/logout`, id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (error) {
    dispatch(logoutFailed());
  }
};
