import { X } from "lucide-react";

const MasterclassFormFields = ({
  formData,
  handleChange,
  handleImageChange,
  removeImage,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title*
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">Kes</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field pl-12"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field min-h-[120px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hero Image
        </label>
        <div className="mt-1 flex items-center">
          <label className="cursor-pointer">
            <span className="btn-primary inline-flex items-center px-3 py-2">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Choose Image
            </span>
            <input
              type="file"
              name="heroImage"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </label>

          {formData.heroImage && (
            <div className="ml-3 flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-sm text-gray-700">
                {formData.heroImage.name}
              </span>
              <button
                type="button"
                onClick={removeImage}
                className="text-[var(--d4a-red)] hover:text-red-700 font-bold text-sm cursor-pointer"
                title="Remove image"
              >
                <X />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Recommended size: 1200x600px
        </p>
      </div>
    </div>
  );
};

export default MasterclassFormFields;
