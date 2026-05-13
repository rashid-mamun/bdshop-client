import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetHours?: number; // hours from now
  className?: string;
}

export function CountdownTimer({ targetHours = 6, className }: CountdownTimerProps) {
  const getTarget = () => {
    const t = new Date();
    t.setHours(t.getHours() + targetHours, 0, 0, 0);
    return t.getTime();
  };

  const [target] = useState(getTarget);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calc = () => setTimeLeft(Math.max(0, target - Date.now()));
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  const h = Math.floor(timeLeft / 3_600_000);
  const m = Math.floor((timeLeft % 3_600_000) / 60_000);
  const s = Math.floor((timeLeft % 60_000) / 1_000);
  const pad = (n: number) => String(n).padStart(2, '0');

  const Digit = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center">
      <div className={`bg-[#1a1a1a] text-white font-mono font-bold text-lg leading-none px-2.5 py-1.5 rounded-lg min-w-[2.5rem] text-center ${className}`}>
        {value}
      </div>
      <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex items-end gap-1.5">
      <Digit value={pad(h)} label="hrs" />
      <span className="text-[#1a1a1a] font-bold text-lg mb-5 leading-none">:</span>
      <Digit value={pad(m)} label="min" />
      <span className="text-[#1a1a1a] font-bold text-lg mb-5 leading-none">:</span>
      <Digit value={pad(s)} label="sec" />
    </div>
  );
}
