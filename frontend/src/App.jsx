import { Routes, Route } from "react-router-dom";
import Header from './Components/header';
import Footer from './Components/footer';
import Home from './pages/Home';
import Contact from './pages/contactus'; // ← import Contact page

function App() {
  return (
    <div className="App">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} /> {/* ← add contact route */}
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
