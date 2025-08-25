import { Routes, Route } from "react-router-dom";
import Header from './Components/header';
import Footer from './Components/footer';
import Home from './pages/Home';
import Contact from './pages/contactus'; // ← import Contact page
import AboutUs from './pages/AboutUs';
import RoleSelect from "./Components/RoleSelect";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";





function App() {
  return (
    <div className="App">
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} /> {/* ← add contact route */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/roleselect" element={<RoleSelect/>} />
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
