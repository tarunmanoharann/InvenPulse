import React from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SearchProducts: React.FC =()=>{
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Search Products</h1>
            <div className="flex mb-6">
                 <Input className="flex-grow mr-2" placeholder="Search for products..."/>
                 <Button>Search</Button>
            </div>
            <div className="grid grid-cols-1">
                {[1, 2, 3, 4, 5, 6].map((i) =>(
                    <Card key={i}>
                        <CardContent className="p-4">
                        <img src={`https://via.placeholder.com/150?text=Product ${i}`} alt={`Product ${i}`} className="w-full h-40 object-cover mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Product {i}</h3>
                        <p className="text-gray-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <p className="font-bold">$19.99</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
    )
}

export default SearchProducts