import "./Header.css";

const Header = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "stray", label: "유기동물 정보" },
    { id: "festival", label: "반려동물 행사정보" },
    { id: "facility", label: "반려동물 관련 시설 정보" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img src="/nukki.png" alt="냥몽 로고" className="logo-img" />
        </div>
        <nav className="nav-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
