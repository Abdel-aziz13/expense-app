import { useState } from "react";

const Loading = () => {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="spinner-border text-pink-400">Loading...</div>
    </div>
  );
};

export default Loading;
