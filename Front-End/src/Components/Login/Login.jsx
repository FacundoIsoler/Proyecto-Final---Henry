import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import Loading from "../Loading/Loading"
import Style from "../Login/Login.module.css"
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  /*   const test = useState()
    useEffect(() => {
      console.log(user.name);
    },[test]) */

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <>
      {
        isAuthenticated ?
          <>
            <div className={Style.person}>
              <NavLink
                to="/Profile"
              >
                <span>Perfil</span>
              </NavLink>
            </div>
            <div className={Style.person}>
              <button
                className={Style.buttonLogin}
                onClick={() => logout({ returnTo: window.location.origin })}
              ></button>
            </div>
          </>
          :
          <div className={Style.person}>
            <button
              className={Style.buttonLogin}
              onClick={() => loginWithRedirect()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </button>
          </div>
      }
    </>
  );
}

