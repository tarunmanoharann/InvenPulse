import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Settings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" placeholder="Enter company name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Contact Email</Label>
          <Input id="email" type="email" placeholder="Enter contact email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Input id="currency" placeholder="Enter default currency" />
        </div>
        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  );
};

export default Settings;