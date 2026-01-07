import "./App.css";
import { useFingerprint } from "./hooks/useFingerprint.";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StrayAnimalList from "./pages/StrayAnimalList";

function App() {
  const { fingerprint, loading } = useFingerprint();

  if (loading) {
    return null;
  }

  return (
    <div className="app-container">
      <Header fingerprint={fingerprint} />
      <main className="main-content">
        <StrayAnimalList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
