import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import Style from "../NavBar/Navbar.module.css";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";




export default function NavBarSupplier(){
const { user, isLoading, isAuthenticated } = useAuth0();
const [userRole, setUserRole] = useState("");

const userLog = useSelector(state => state.userLog);
let role;
if(user) role = userLog;

useEffect(() => {
    if (!isLoading && isAuthenticated && role) setUserRole(role);
}, [isLoading, isAuthenticated, role]);



    return (
                userRole === "User" ?
                    <NavLink
                        className={({ isActive }) =>
                            isActive ? Style.active : Style.inactive
                        }
                        to="/suppliersContact"
                    >

                        <div className={`${Style.link} nav-link`}>
                            <span>Publicá tu servicio</span>
                        </div>

                    </NavLink>
                    : null
    )
}
