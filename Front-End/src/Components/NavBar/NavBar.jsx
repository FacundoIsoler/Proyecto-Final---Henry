import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar.jsx";
import Login from "../Login/Login";
import Style from "../NavBar/Navbar.module.css";
import { useSelector } from "react-redux";
// import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import NavBarSupplier from "./NavBarSupplier.jsx";



export default function NavBar() {
  let cart = useSelector((state) => state.cart)
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [userRole, setUserRole] = useState("User");

  const userLog = useSelector(state => state.userLog);
  let role;
  if(user) role = userLog;

  useEffect(() => {
    if (!isLoading && isAuthenticated && role) setUserRole(role);
  }, [isLoading, isAuthenticated, role]);

  console.log(userRole)
  console.log(role)


  return (
    <main className={Style.main}>
      <nav className={`${Style.container}`}>
        <div className="nav">
          <div className={`${Style.logo}`}>
            <NavLink to="/">
              <button className={`${Style.logo}`}></button>
            </NavLink>
          </div>
          <div className={`dropdown ${Style.btnHiden}`}>
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/suppliers" className="dropdown-item">
              <span>Cartilla de proveedores</span>
              </NavLink>
              </li>
              <li>
              <NavLink to="/contact" className="dropdown-item">
              <span>Contacto</span>
              </NavLink>
              </li>
              {userRole === "User" ? <li>
              <NavLink to="/suppliersContact" className="dropdown-item">
              <span>Publicá tu empresa</span>
              </NavLink>
              </li> : ""}
            </ul>
          </div>
          <NavLink
            className={({ isActive }) =>
              isActive ? Style.active : Style.inactive
            }
            to="/suppliers"
          >
            <div className={`${Style.link} nav-link`}>
              <span>Cartilla de proveedores</span>
            </div>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? Style.active : Style.inactive
            }
            to="/contact"
          >
            <div className={`${Style.link} nav-link`}>
              <span>Contacto</span>
            </div>
          </NavLink>

          {
            userRole === "User" ?
              <NavBarSupplier />
              : ""
          }

          <div className={`${Style.nav_right} d-flex justify-content-end col`}>
            <Searchbar />
            <Login></Login>
            { role !== "Supplier" ?
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? Style.active : Style.inactive
                }
              >
                <div className={Style.cart}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>


                  {
                    cart.length > 0
                      ?
                      <p className="btn btn-danger" >{cart.length}</p>
                      :
                      ""

                  }
                </div>
              </NavLink>
              : null
            }
          </div>
        </div>
      </nav>
      <section >
        <Outlet />
      </section>
    </main>
  );
}
