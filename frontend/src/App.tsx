import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import TopBanner from "./components/TopBanner";
import HeroBanner from "./components/HeroBanner";
import FeaturedProducts from "./components/FeaturedProducts";
import Services from "./components/Services";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

function HomePage() {
  return (
    <>
      <TopBanner />
      <HeroBanner />
      <FeaturedProducts />
      <Services />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="page">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
