// user/HelpSupport.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const HelpSupport: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li>
                <h3 className="font-semibold">How do I track my order?</h3>
                <p className="text-sm text-gray-600">You can track your order in the Orders section of your dashboard.</p>
              </li>
              <li>
                <h3 className="font-semibold">How can I update my payment information?</h3>
                <p className="text-sm text-gray-600">Go to your User Profile and select the Payment Methods tab to update your information.</p>
              </li>
              <li>
                <h3 className="font-semibold">What should I do if an item is out of stock?</h3>
                <p className="text-sm text-gray-600">You can enable notifications for when the item is back in stock on the product page.</p>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input id="subject" placeholder="Enter the subject of your inquiry" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea id="message" placeholder="Describe your issue or question" rows={4} />
              </div>
              <Button>Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport;