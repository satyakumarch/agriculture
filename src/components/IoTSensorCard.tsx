
import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Battery, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SensorData {
  id: string;
  name: string;
  location: string;
  type: 'temperature' | 'moisture' | 'humidity' | 'wind' | 'rainfall';
  value: number;
  unit: string;
  timestamp: string;
  batteryLevel: number;
  signalStrength: number;
  status: 'normal' | 'warning' | 'critical';
}

interface IoTSensorCardProps {
  data: SensorData;
  className?: string;
}

const IoTSensorCard: React.FC<IoTSensorCardProps> = ({ data, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate data updates with animation
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (data.type) {
      case 'temperature':
        return <Thermometer className="h-6 w-6 text-red-500" />;
      case 'moisture':
        return <Droplets className="h-6 w-6 text-sky-500" />;
      case 'humidity':
        return <Droplets className="h-6 w-6 text-blue-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-gray-500" />;
      default:
        return <Thermometer className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  const getBatteryIcon = () => {
    if (data.batteryLevel > 75) {
      return <Battery className="h-4 w-4 text-green-500" />;
    } else if (data.batteryLevel > 25) {
      return <Battery className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Battery className="h-4 w-4 text-red-500" />;
    }
  };

  const getSignalIcon = () => {
    if (data.signalStrength > 75) {
      return <Wifi className="h-4 w-4 text-green-500" />;
    } else if (data.signalStrength > 25) {
      return <Wifi className="h-4 w-4 text-yellow-500" />;
    } else {
      return <Wifi className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "glass-card p-4 transition-all duration-300",
        isAnimating && "shadow-lg translate-y-[-2px]",
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {getIcon()}
          <div className="ml-2">
            <h3 className="font-medium text-base">{data.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{data.location}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
      </div>
      
      <div className="flex items-end mt-4 mb-2">
        <div className={cn(
          "text-3xl font-bold transition-all",
          isAnimating && "text-primary scale-110"
        )}>
          {data.value}
        </div>
        <div className="text-sm ml-1 mb-1 text-gray-500 dark:text-gray-400">
          {data.unit}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          {getBatteryIcon()}
          <span className="ml-1">{data.batteryLevel}%</span>
        </div>
        <div className="flex items-center">
          {getSignalIcon()}
          <span className="ml-1">{data.signalStrength}%</span>
        </div>
        <div>{new Date(data.timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
};

export default IoTSensorCard;
