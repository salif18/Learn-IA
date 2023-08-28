import React from "react";
import {Routes, Route } from 'react-router-dom'
import Annalyse2D from "./pages/Annalyse2D";
import Classification from "./pages/Classification";
import Reconnaissance from "./pages/Reconnaissance";
import Home from "./pages/Home";
import Header from "./components/Header";

function App() {
    
  return (
    <div className="App">
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/dimension2" element={<Annalyse2D/>}/>
        <Route path='/classification' element={<Classification/>}/>
        <Route path='/reconnaissance' element={<Reconnaissance/>}/>
      </Routes>
    </div>
  );
}

export default App;
