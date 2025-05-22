const Input = ({
  label,
  id,
  type = 'text',
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 bg-gray-700 border ${
          error ? 'border-red-500' : 'border-gray-600'
        } rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
