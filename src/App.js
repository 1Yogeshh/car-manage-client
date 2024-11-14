// src/App.js
import React from "react";
import { BrowserRouter as Router,Routes, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Register from "./Components/Register";
import Login from "./Components/Login";
import CarList from "./Components/CarList";
import CarDetail from "./Components/CarDetails";
import CarForm from "./Components/CarForm";
import UpdateCarPage from "./Components/CarUpdate";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cars" exact element={<CarList/>} />
        <Route path="/cars/:id" element={<CarDetail/>} />
        <Route path="/cars/update/:id" element={<UpdateCarPage/>}/>
        <Route
          path="/create-car"
          element={<CarForm/>}
        />
        <Route
          path="/edit-car/:id"
          element={() => <CarForm car={{}} onSubmit={() => {}} />}
        />
      </Routes>
    </Router>
    
  );
};

export default App;
