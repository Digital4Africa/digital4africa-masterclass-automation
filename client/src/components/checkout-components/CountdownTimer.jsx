import { useState, useEffect } from 'react';

const CountdownTimer = ({ startDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(startDate);
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Class Starts Soon!</h3>
      <div className="flex justify-between max-w-xs">
        <div className="text-center">
          <div className="bg-blue-100 text-[#0060a1] rounded-lg py-2 px-3">
            <span className="text-xl font-bold">{timeLeft.days}</span>
          </div>
          <span className="text-xs text-gray-500">Days</span>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 text-[#0060a1] rounded-lg py-2 px-3">
            <span className="text-xl font-bold">{timeLeft.hours}</span>
          </div>
          <span className="text-xs text-gray-500">Hours</span>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 text-[#0060a1] rounded-lg py-2 px-3">
            <span className="text-xl font-bold">{timeLeft.minutes}</span>
          </div>
          <span className="text-xs text-gray-500">Minutes</span>
        </div>
        <div className="text-center">
          <div className="bg-blue-100 text-[#0060a1] rounded-lg py-2 px-3">
            <span className="text-xl font-bold">{timeLeft.seconds}</span>
          </div>
          <span className="text-xs text-gray-500">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;