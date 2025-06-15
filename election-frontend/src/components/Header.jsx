const Header = ({ onLoginClick, onSignupClick }) => (
  <header className="bg-blue-600 text-white p-4 flex justify-between">
    <h2 className="text-xl font-bold">Election Portal</h2>
    <div>
      <button
        onClick={onLoginClick}
        className="bg-white text-blue-600 px-4 py-1 rounded">
        Login
      </button>
      <button
        onClick={onSignupClick}
        className="bg-white text-blue-600 px-4 py-1 rounded">
        Signup
      </button>
    </div>
  </header>
);

export default Header;
