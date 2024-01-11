import "./Header.css";

const Header = () => {
  return (
    <div className="main-header">
      <img
        className="header-image"
        src={require("../../assets/logo.jpg")}
        alt="popcornica"
      />
      <h2 className="header-text">AI Chatbot</h2>
    </div>
  );
};

export default Header;
