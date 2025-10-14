
import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import IoTSensorCard from '@/components/IoTSensorCard';
import AddSensorModal from '@/components/modals/AddSensorModal';
import { Button } from '@/components/ui/button';
import { Wifi, PlusCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SensorData {
  id: string;
  name: string;
  location: string;
  type: 'moisture' | 'temperature' | 'humidity' | 'wind' | 'rainfall';
  value: number;
  unit: string;
  timestamp: string;
  batteryLevel: number;
  signalStrength: number;
  status: 'normal' | 'warning' | 'critical';
}

const IoTMonitoring = () => {
  const [addSensorModalOpen, setAddSensorModalOpen] = useState(false);
  
  // Sample sensor data
  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      id: 'sensor-1',
      name: 'Soil Moisture Sensor',
      location: 'North Field - Plot A',
      type: 'moisture' as const,
      value: 42,
      unit: '%',
      timestamp: new Date().toISOString(),
      batteryLevel: 78,
      signalStrength: 92,
      status: 'normal' as const,
    },
    {
      id: 'sensor-2',
      name: 'Temperature Sensor',
      location: 'Greenhouse 1',
      type: 'temperature' as const,
      value: 26.5,
      unit: '°C',
      timestamp: new Date().toISOString(),
      batteryLevel: 65,
      signalStrength: 87,
      status: 'normal' as const,
    },
    {
      id: 'sensor-3',
      name: 'Wind Sensor',
      location: 'Weather Station',
      type: 'wind' as const,
      value: 12.4,
      unit: 'km/h',
      timestamp: new Date().toISOString(),
      batteryLevel: 88,
      signalStrength: 94,
      status: 'normal' as const,
    },
    {
    id: 'sensor-4',
    name: 'Rainfall Sensor',
    location: 'South Field - Irrigation Zone',
    type: 'rainfall' as const,
    value: 4.2,
    unit: 'mm',
    timestamp: new Date().toISOString(),
    batteryLevel: 82,
    signalStrength: 90,
    status: 'normal' as const,
  },
  ]);

  const handleAddSensor = (newSensor: SensorData) => {
    setSensorData(prev => [...prev, newSensor]);
    toast({
      title: "Sensor Added Successfully",
      description: `${newSensor.name} has been added to your IoT monitoring system.`,
    });
  };

  const handleRefreshData = () => {
    // Simulate refreshing sensor data
    setSensorData(prev => prev.map(sensor => ({
      ...sensor,
      timestamp: new Date().toISOString(),
      // Simulate small changes in values
      value: sensor.type === 'temperature' 
        ? Math.max(0, sensor.value + (Math.random() - 0.5) * 2)
        : Math.max(0, sensor.value + (Math.random() - 0.5) * 5),
    })));
    
    toast({
      title: "Data Refreshed",
      description: "All sensor readings have been updated with the latest values.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/30 rounded-full px-3 py-1 text-sm font-medium text-sky-800 dark:text-sky-300 mb-3">
              <Wifi className="h-4 w-4" />
              <span>Real-time Monitoring</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">IoT Farm Monitoring</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Monitor your farm in real-time with connected IoT sensors providing critical data about soil, weather, and growing conditions.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-2xl font-bold mb-4 md:mb-0">Sensor Dashboard</h2>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleRefreshData}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
                </Button>
                <Button size="sm" onClick={() => setAddSensorModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Sensor
                </Button>
              </div>
            </div>
            
            {/* Sensor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {sensorData.map(sensor => (
                <IoTSensorCard key={sensor.id} data={sensor} />
              ))}
            </div>
            
            {/* System Overview */}
            <div className="glass-card p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">IoT System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">Supported Sensors</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Soil moisture sensors (0-100%)</li>
                    <li>Temperature sensors (-40°C to +85°C)</li>
                    <li>Humidity sensors (0-100%)</li>
                    <li>Light intensity sensors</li>
                    <li>Wind speed and direction sensors</li>
                    <li>Rain gauges</li>
                    <li>CO2 concentration sensors</li>
                    <li>pH sensors for soil and water</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Connectivity Options</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>LoRaWAN for long-range, low-power sensing</li>
                    <li>WiFi for high-bandwidth applications</li>
                    <li>Bluetooth for local sensor configuration</li>
                    <li>Cellular (4G/LTE) for remote locations</li>
                    <li>Zigbee for mesh network configurations</li>
                    <li>Satellite connectivity for ultra-remote areas</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">System Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Real-time monitoring and alerts</li>
                    <li>Historical data analysis and trends</li>
                    <li>Automated irrigation control</li>
                    <li>Weather-based decision support</li>
                    <li>Battery and connectivity monitoring</li>
                    <li>Mobile app for on-the-go access</li>
                    <li>API access for custom integrations</li>
                    <li>Automated reporting and notifications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 rounded-xl p-8 mb-12">
              <h2 className="text-2xl font-bold mb-6">Benefits of IoT Farming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-3">Resource Optimization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    With precise soil moisture monitoring, farmers can reduce water usage by up to 30% while maintaining optimal growing conditions. IoT systems help apply water and fertilizer exactly where and when needed.
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-3">Early Problem Detection</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Continuous monitoring allows for early detection of issues like drought stress, pest infestations, or equipment failures before they cause significant damage to crops or infrastructure.
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-3">Data-Driven Decisions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Transform your farming practices with accurate, real-time data. Make informed decisions about planting, irrigation, fertilization, and harvesting based on actual field conditions.
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h3 className="text-lg font-medium mb-3">Labor Savings</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Reduce manual field checks and automate routine tasks. Remote monitoring allows you to oversee multiple areas of your farm simultaneously, saving time and labor costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AddSensorModal 
        open={addSensorModalOpen}
        onOpenChange={setAddSensorModalOpen}
        onAddSensor={handleAddSensor}
      />
    </div>
  );
};

export default IoTMonitoring;
