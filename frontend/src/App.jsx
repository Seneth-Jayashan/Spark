import { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Header from './Components/header'
import Footer from './Components/footer';
import Home from './pages/Home';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />   
      <Home />
      <Footer />
    </div>
  )
}

export default App
