import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Plus, Trash2, Send, CheckCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface SOSLog {
  id: string;
  timestamp: Date;
  location: string;
  status: 'sent' | 'acknowledged';
}

const EmergencySOS = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Ramesh (Brother)', phone: '+91 98765 43210', relation: 'Family' },
    { id: '2', name: 'Village Sarpanch', phone: '+91 87654 32109', relation: 'Community' },
    { id: '3', name: 'Local Police', phone: '100', relation: 'Emergency' },
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [sosLogs, setSosLogs] = useState<SOSLog[]>([]);
  const [sosSent, setSosSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'GPS Not Available', description: 'Your browser does not support geolocation.', variant: 'destructive' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}` });
        toast({ title: 'Location Acquired', description: 'Your GPS location has been captured.' });
      },
      () => {
        // Fallback mock location
        setLocation({ lat: 28.6139, lng: 77.2090, address: 'New Delhi, India (Demo)' });
        toast({ title: 'Using Demo Location', description: 'GPS unavailable. Using demo location.' });
      }
    );
  };

  const sendSOS = () => {
    if (!location) {
      toast({ title: 'No Location', description: 'Please get your location first.', variant: 'destructive' });
      return;
    }
    setSosSent(true);
    setCountdown(5);
    const log: SOSLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      location: location.address,
      status: 'sent',
    };
    setSosLogs(prev => [log, ...prev]);
    toast({ title: '🚨 SOS Alert Sent!', description: `Emergency alert sent to ${contacts.length} contacts with your location.`, variant: 'destructive' });

    // Simulate acknowledgment
    setTimeout(() => {
      setSosLogs(prev => prev.map(l => l.id === log.id ? { ...l, status: 'acknowledged' } : l));
      toast({ title: '✅ SOS Acknowledged', description: 'Ramesh (Brother) has acknowledged your SOS.' });
    }, 4000);
  };

  const cancelSOS = () => {
    setSosSent(false);
    setCountdown(0);
    toast({ title: 'SOS Cancelled', description: 'Emergency alert has been cancelled.' });
  };

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const addContact = () => {
    if (!newName || !newPhone) return;
    setContacts(prev => [...prev, { id: Date.now().toString(), name: newName, phone: newPhone, relation: newRelation || 'Other' }]);
    setNewName(''); setNewPhone(''); setNewRelation('');
    toast({ title: 'Contact Added', description: `${newName} added to emergency contacts.` });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 rounded-full px-3 py-1 text-sm font-medium text-red-800 dark:text-red-300 mb-3">
              <Shield className="h-4 w-4" />
              <span>Emergency Safety</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Emergency SOS & Location Sharing</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Send instant SOS alerts with your real-time GPS location to emergency contacts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SOS Panel */}
            <div className="space-y-4">
              {/* Location */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> Your Location</CardTitle></CardHeader>
                <CardContent>
                  {location ? (
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Location Captured</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{location.address}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3 text-sm text-gray-500">
                      Location not yet captured. Click below to get GPS location.
                    </div>
                  )}
                  <Button variant="outline" className="w-full" onClick={getLocation}>
                    <MapPin className="h-4 w-4 mr-2" /> {location ? 'Update Location' : 'Get My Location'}
                  </Button>
                </CardContent>
              </Card>

              {/* SOS Button */}
              <div className="glass-card rounded-xl p-6 text-center">
                {!sosSent ? (
                  <>
                    <button onClick={sendSOS}
                      className="w-36 h-36 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xl shadow-2xl shadow-red-500/50 transition-all mx-auto flex flex-col items-center justify-center gap-1 border-4 border-red-400">
                      <AlertTriangle className="h-10 w-10" />
                      SOS
                    </button>
                    <p className="text-sm text-gray-500 mt-4">Press to send emergency alert to all contacts</p>
                  </>
                ) : (
                  <>
                    <div className="w-36 h-36 rounded-full bg-red-100 dark:bg-red-900/30 border-4 border-red-500 mx-auto flex flex-col items-center justify-center gap-1 animate-pulse">
                      <Send className="h-10 w-10 text-red-600" />
                      <span className="text-red-600 font-bold">SENT</span>
                    </div>
                    <p className="text-sm text-red-600 font-semibold mt-4">🚨 SOS Alert Active — Help is on the way</p>
                    <Button variant="outline" className="mt-3 border-red-300 text-red-600" onClick={cancelSOS}>Cancel SOS</Button>
                  </>
                )}
              </div>

              {/* SOS Logs */}
              {sosLogs.length > 0 && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Alert History</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {sosLogs.map(log => (
                      <div key={log.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{log.timestamp.toLocaleTimeString()}</p>
                          <p className="text-gray-500">{log.location}</p>
                        </div>
                        <Badge variant={log.status === 'acknowledged' ? 'default' : 'secondary'} className="text-xs">
                          {log.status === 'acknowledged' ? '✅ Acknowledged' : '📤 Sent'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Phone className="h-4 w-4 text-blue-500" /> Emergency Contacts ({contacts.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {contacts.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.phone} · {c.relation}</p>
                      </div>
                      <button onClick={() => removeContact(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Plus className="h-4 w-4" /> Add Contact</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Input placeholder="Contact name" value={newName} onChange={e => setNewName(e.target.value)} />
                  <Input placeholder="Phone number" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                  <Input placeholder="Relation (Family, Friend...)" value={newRelation} onChange={e => setNewRelation(e.target.value)} />
                  <Button onClick={addContact} className="w-full" disabled={!newName || !newPhone}>
                    <Plus className="h-4 w-4 mr-2" /> Add Contact
                  </Button>
                </CardContent>
              </Card>

              {/* Emergency Numbers */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">National Emergency Numbers</CardTitle></CardHeader>
                <CardContent className="space-y-1.5">
                  {[['Police', '100'], ['Ambulance', '108'], ['Fire', '101'], ['Disaster Mgmt', '1078'], ['Kisan Call Center', '1800-180-1551']].map(([name, num]) => (
                    <div key={name} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">{name}</span>
                      <a href={`tel:${num}`} className="font-bold text-red-600 hover:underline">{num}</a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmergencySOS;
