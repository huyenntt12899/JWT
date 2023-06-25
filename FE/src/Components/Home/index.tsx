import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../axiosInstance";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./index.css";

const HomePage = () => {
  const user = useSelector((state: any) => state.auth.login?.currentUser);
  const allUsers = useSelector((state: any) => state.users.users.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispatch);

  useEffect(() => {
    if (!user) navigate("/login");
    if (user?.accessToken) getAllUsers(user?.accessToken, dispatch, axiosJWT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteUser = (id: string) => {
    deleteUser(id, user?.accessToken, dispatch, axiosJWT);
  };

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-userlist">
        {allUsers?.map((user: any) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => handleDeleteUser(user?._id)}
              >
                Delete
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default HomePage;
