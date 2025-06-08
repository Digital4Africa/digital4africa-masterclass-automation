const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <img
          src="https://res.cloudinary.com/diizjejos/image/upload/v1746761694/logo_b6qvn2.png"
          alt="Digital4Africa Logo"
          className="h-8 w-auto mr-3"
        />
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Digital4Africa</h1>
          <p className="text-sm text-gray-600">Premium Masterclasses</p>
        </div>
      </div>
    </div>
  );
};

export default Header;