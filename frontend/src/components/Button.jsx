const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
