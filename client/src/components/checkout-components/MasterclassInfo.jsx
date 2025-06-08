const MasterclassInfo = ({ title, description, image, price }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 sm:h-64 object-cover"
      />

      <div className="p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="flex items-center justify-between">
          <div>
            {/* <span className="text-sm text-gray-500">Investment</span> */}
            <p className="text-2xl font-bold text-[#d20a11]">
              {(price).toLocaleString('en-US', { style: 'currency', currency: 'KES' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterclassInfo;