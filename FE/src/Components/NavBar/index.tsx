import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createAxios } from "../../axiosInstance";
import { logout } from "../../redux/apiRequest";
import "./index.css";
const NavBar = () => {
  const user = useSelector((state: any) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = user?.accessToken;
  const axiosJWT = createAxios(user, dispatch);
  const handleLogout = async () => {
    await logout(user?._id, navigate, accessToken, dispatch);
  };
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home">
        Home
      </Link>
      {user ? (
        <>
          <p className="navbar-user">
            Hi, <span> {user?.username ?? ""} </span>
          </p>
          <Link to="/logout" className="navbar-logout" onClick={handleLogout}>
            Log out
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login">
            Login
          </Link>
          <Link to="/register" className="navbar-register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
