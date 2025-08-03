import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Header from './Components/header'
import Footer from './Components/footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header /> 
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/about' element={<AboutUs/>}/>
      </Routes>  
      <Footer />
    </div>
  )
}

export default App
