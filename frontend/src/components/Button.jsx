function Button({ children, type = "button", onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-black px-5 py-2.5 font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export default Button;
