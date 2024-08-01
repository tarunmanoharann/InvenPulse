//user/UserProfile.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const UserProfile: React.FC =()=>
{
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )

}

export default UserProfile;