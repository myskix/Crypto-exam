import React, { useState, useEffect } from "react";

const Countdown = ({ deadline, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("WAKTU HABIS");
        if (onExpire) onExpire();
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full font-mono font-bold text-sm border border-red-100 flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>
      Sisa Waktu: {timeLeft}
    </div>
  );
};

export default Countdown;
