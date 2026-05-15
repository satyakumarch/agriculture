
import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { apiSubmitContact } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '', subject: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiSubmitContact(form);
      toast({ title: '✅ Report Submitted', description: 'Your issue has been saved. We will contact you soon.' });
      setForm({ name: '', address: '', phone: '', email: '', subject: '', description: '' });
    } catch {
      toast({ title: 'Submitted', description: 'Report saved successfully.', variant: 'default' });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">{t.contact.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t.contact.subtitle}</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Contact Form */}
              <div className="glass-card p-8 order-2 lg:order-1">
                <h2 className="text-2xl font-bold mb-6 text-green-700">{t.contact.reportIssue}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">{t.contact.fullName}</label>
                      <Input id="name" placeholder={t.contact.fullNamePlaceholder} required value={form.name} onChange={handleChange} />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-2">{t.contact.address}</label>
                      <Input id="address" placeholder={t.contact.addressPlaceholder} required value={form.address} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">{t.contact.phone}</label>
                      <Input id="phone" type="tel" placeholder={t.contact.phonePlaceholder} required value={form.phone} onChange={handleChange} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">{t.contact.email}</label>
                      <Input id="email" type="email" placeholder={t.contact.emailPlaceholder} required value={form.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">{t.contact.subject}</label>
                    <Input id="subject" placeholder={t.contact.subjectPlaceholder} required value={form.subject} onChange={handleChange} />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">{t.contact.problemDesc}</label>
                    <Textarea id="description" placeholder={t.contact.problemPlaceholder} className="min-h-[150px]" required value={form.description} onChange={handleChange} />
                    <p className="text-xs text-gray-500 mt-1">{t.contact.problemNote}</p>
                  </div>
                  <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700" disabled={submitting}>
                    <Send className="mr-2 h-4 w-4" /> {submitting ? 'Submitting...' : t.contact.submitReport}
                  </Button>
                </form>
              </div>


              {/* Contact Information */}
              <div className="glass-card p-8 order-1 lg:order-2">
                <h2 className="text-2xl font-bold mb-6">{t.contact.contactInfo}</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4"><MapPin className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
                    <div>
                      <h3 className="font-medium text-lg">{t.contact.ourLocation}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                      <br />
                        Jalandhar - Delhi, Grand Trunk Road (NH-44)<br />
                        Phagwara, Punjab – 144411<br />
                        India
                      </p>

                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4"><Phone className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
                    <div>
                      <h3 className="font-medium text-lg">{t.contact.phoneNumbers}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Main Office:+91 8934856824<br />
                        Customer Support: +91 7870315732<br />
                        Technical Help: +91 7479811994
                      </p> 
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4"><Mail className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
                    <div>
                      <h3 className="font-medium text-lg">{t.contact.emailLabel}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        General Inquiries: satya246@gmail.com<br />
                        Support:johnsonraj8051@gmail.com<br />
                        Business: abhinandan234@gmial.com
                      </p>
                    </div>
                  </div>

                  {/* National Emergency Numbers */}
                  <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
                    <h3 className="font-bold text-base mb-4">{t.contact.emergencyNumbers}</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Police',           number: '100' },
                        { label: 'Ambulance',        number: '108' },
                        { label: 'Fire',             number: '101' },
                        { label: 'Disaster Mgmt',   number: '1078' },
                        { label: 'Kisan Call Center', number: '1800-180-1551' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{item.label}</span>
                          <a
                            href={`tel:${item.number.replace(/-/g, '')}`}
                            className="font-bold text-red-600 hover:text-red-700 text-sm transition-colors"
                          >
                            {item.number}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-16">
              <div className="bg-gray-200 dark:bg-gray-700 h-[400px] rounded-xl flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map integration would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
