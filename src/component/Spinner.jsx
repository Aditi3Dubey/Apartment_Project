const Spinner = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-white/80 text-sm">Loading assets...</span>
  </div>
);

export default Spinner;
