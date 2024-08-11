//user/UserProfile.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const UserProfile: React.FC =()=>
{
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4"> 
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                            <Input id="name" defaultValue="John Doe"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <Input id="email" type="email" defaultValue="john@example.com" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                            <Input id="phone" defaultValue="+1 234 567 8900" />
                        </div>
                        <Button>Update Profile</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )

}

export default UserProfile;