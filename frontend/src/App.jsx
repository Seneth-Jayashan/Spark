import { Routes, Route } from "react-router-dom";
import Header from './Components/header';
import Footer from './Components/footer';
import Home from './pages/Home';
import Contact from './pages/contactus'; // ← import Contact page
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <div className="App">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} /> {/* ← add contact route */}
        <Route path="/about" element={<AboutUs />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
