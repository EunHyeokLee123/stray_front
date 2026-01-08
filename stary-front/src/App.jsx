import { useState } from "react";
import "./App.css";
import { useFingerprint } from "./hooks/useFingerprint.";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StrayAnimalList from "./pages/StrayAnimalList";
import FestivalList from "./pages/FestivalList";
import FacilityMapPage from "./pages/FacilityMapPage";

function App() {
  const { fingerprint, loading } = useFingerprint();
  const [activeTab, setActiveTab] = useState("stray");

  if (loading) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "festival":
        return <FestivalList />;
      case "facility":
        return <FacilityMapPage />;
      case "stray":
      default:
        return <StrayAnimalList />;
    }
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default App;
