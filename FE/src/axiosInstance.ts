import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshToken } from "./redux/apiRequest";
import { AnyAction, Dispatch } from "redux";
import { loginSuccess } from "./redux/authSlice";
import { IUserResponseLogin } from "./redux/model";

export const createAxios = (
  user: IUserResponseLogin,
  dispatch: Dispatch<AnyAction>
) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      const date = new Date();
      const decodedToken: any = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        dispatch(loginSuccess(refreshUser));
        config.headers["token"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return newInstance;
};
