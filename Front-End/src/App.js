import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
//styles
// import "jquery/dist/jquery.min.js";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
//components
import Home from "./Components/Home/Home.jsx";
import NavBar from "./Components/NavBar/NavBar.jsx";
import { Suppliers } from "./Components/Suppliers/Suppliers.jsx";
import { Contact } from "./Components/Contact/Contact.jsx";
import { Cart } from "./Components/Cart/Cart.jsx";
import Profile from "./Components/Profile/Profile";
import { ShopForm } from "./Components/ShopForm.jsx/ShopForm";

import { SuppliersDetail } from "./Components/SuppliersDetail/SuppliersDetail";
import { useDispatch } from "react-redux";
import { init, showCart } from "../src/actions/index.js";
import { ServicesDetail } from "./Components/ServicesDetail/ServicesDetail";
import { FormSuppliers } from "./Components/FormSuppliers/FormSuppliers";
import { Footer } from "./Components/Footer/Footer";
import { ProtectedRoute } from "./Components/ProtectedRoute/ProtectedRoute";
import UserDetails from "./Components/Profile/UsersList/UserDetails/UserDetails";
import ContractDetails from "./Components/Profile/ContractList/ContractDetails/ContractDetails";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const localStorageMap = allKeys.map((key) => localStorage.getItem(key));
    const localStorageFilter = localStorageMap.filter((e) =>
      e.includes("serviceType")
    );
    const localStorageMaping = localStorageFilter.map((e) => JSON.parse(e));

    dispatch(showCart(localStorageMaping));
    dispatch(init());
  }, [dispatch]);

  let location = useLocation();
  useEffect(() => {
    if (
      location.search.includes("success=true")
    ) {
      localStorage.clear();
    }
    // console.log(location.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/suppliers/:id" element={<SuppliersDetail />} />
        <Route path="/suppliersContact" element={<FormSuppliers />} />
        <Route path="/services/:d" element={<ServicesDetail />} />
        <Route path="/profile/user" element={
          <ProtectedRoute>
            <UserDetails/>
          </ProtectedRoute>
        }/>
        <Route path="/buy" element={
          <ProtectedRoute>
            <ShopForm />
          </ProtectedRoute>
        } />
        <Route path="/profile/contract/:id" element={
        <ProtectedRoute>
          <ContractDetails/>
        </ProtectedRoute>
      } />

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
     
      <Footer />
    </div>
  );
}

export default App;
