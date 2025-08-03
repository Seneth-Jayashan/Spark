import { Routes, Route } from "react-router-dom";
import Header from './Components/header';
import Footer from './Components/footer';
import Home from './pages/Home';
<<<<<<< HEAD
import Contact from './pages/contactus'; // ← import Contact page
=======
import AboutUs from './pages/AboutUs';

>>>>>>> tharusha-new-01

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} /> {/* ← add contact route */}
      </Routes>
      
=======
      <Header /> 
      <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/about' element={<AboutUs/>}/>
      </Routes>  
>>>>>>> tharusha-new-01
      <Footer />
    </div>
  );
}

export default App;
