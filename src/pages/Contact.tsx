
import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get in touch with our agricultural experts for personalized assistance with your farm management
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Contact Form */}
              <div className="glass-card p-8 order-2 lg:order-1">
                <h2 className="text-2xl font-bold mb-6 text-green-700">Report an Agricultural Issue</h2>
                <form className="space-y-6">
                  {/* Name & Address */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                      <Input id="name" placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
                      <Input id="address" placeholder="Enter your village or farm location" required />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                      <Input id="email" type="email" placeholder="Enter your email address" required />
                    </div>
                  </div>

                  {/* Seed Problem Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      id="subject"
                      placeholder="Example: Problem with maize seed growth"
                      required
                    />
                  </div>

                  {/* Problem Description */}
                  <div>
                    <label htmlFor="problem" className="block text-sm font-medium mb-2">Problem Description</label>
                    <Textarea
                      id="problem"
                      placeholder="Describe the issue with your seed or crop in detail..."
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Note: Please include the crop type, soil condition, and any visible symptoms.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                    <Send className="mr-2 h-4 w-4" /> Submit Report
                  </Button>
                </form>
              </div>


              {/* Contact Information */}
              <div className="glass-card p-8 order-1 lg:order-2">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Our Location</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Lovely Professional University<br />
                        Jalandhar - Delhi, Grand Trunk Road (NH-44)<br />
                        Phagwara, Punjab – 144411<br />
                        India
                      </p>

                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Phone Numbers</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Main Office:+91 8934856824<br />
                        Customer Support: (123) 456-7891<br />
                        Technical Help: (123) 456-7892
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        General Inquiries: info@agriassist.com<br />
                        Support: support@agriassist.com<br />
                        Business: business@agriassist.com
                      </p>
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
