import authSlice from "./authSlice";

interface IUserResponseLogin {
  _id: string;
  username: string;
  email: string;
  admin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  accessToken: string;
}

export interface ILoginAction {
  payload: IUserResponseLogin | null;
  type: string;
}

interface ILoginAuthState {
  currentUser: IUserResponseLogin | null;
  isLoading: boolean;
  error: boolean;
}

interface IRegisterAuthState {
  success: boolean;
  isLoading: boolean;
  error: boolean;
}
