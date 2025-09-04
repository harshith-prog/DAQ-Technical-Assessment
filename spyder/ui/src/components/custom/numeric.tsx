interface TemperatureProps {
  temp: any;
}

// Helper to get the Tailwind color class
function getTempColor(temp: number) {
  if (temp < 20 || temp > 80) return "text-red-600";
  if ((temp >= 20 && temp < 25) || (temp > 75 && temp <= 80)) return "text-yellow-500";
  return "text-green-600";
}

function Numeric({ temp }: TemperatureProps) {
  const colorClass = getTempColor(Number(temp));

  return (
    <div className={`text-4xl font-bold ${colorClass}`}>
      {`${Number(temp).toFixed(3)}°C`}
    </div>
  );
}

export default Numeric;
