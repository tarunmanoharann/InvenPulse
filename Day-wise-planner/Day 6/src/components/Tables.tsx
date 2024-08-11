import { useUser } from "@/global/useUser";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconEdit,
  IconMoon,
  IconSettings,
  IconSun,
  IconTrash,
  IconUserBolt,
} from "@tabler/icons-react";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Links, Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Tabs } from "./ui/tabs";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}
interface Supplier{
  supplierId:number;
  supplierName:string;
  contactInfo:string;
  performanceRating:number;
}
interface Product {
  productId:number;
  productName:string;
  category:string;
  price:number;
  cost:number;
  stockLevel:number;
  reorderLevel:number;
  supplier:Supplier;
}
interface Review{
  reviewId:number;
  product:Product;
  user:User;
  reviewText:string;
  reviewDate: Date;
  sentimentScore: number;
}
interface PO{
  orderId:number;
  supplier:Supplier;
  product:Product;
  orderDate:Date;
  quantity: number;
  status:string;
  total_cost: number;
}


interface EditModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}
interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedProduct) {
      setEditedProduct(prev => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      onSave(editedProduct);
    }
  };

  if (!editedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl max-w-4xl w-full">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={editedProduct.productName}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={editedProduct.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Sale Price</label>
            <input
              type="number"
              name="price"
              value={editedProduct.price}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Cost</label>
            <input
              type="number"
              name="cost"
              value={editedProduct.cost}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Stock Level</label>
            <input
              type="number"
              name="stockLevel"
              value={editedProduct.stockLevel}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Reorder Level</label>
            <input
              type="number"
              name="reorderLevel"
              value={editedProduct.reorderLevel}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-2">Supplier Name</label>
            <input
              type="text"
              name="supplierName"
              value={editedProduct.supplier.supplierName}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="flex justify-end col-span-full mt-4">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditModal: React.FC<EditModalProps> = ({ user, onClose, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>({ id: 0, firstname: '', lastname: '', email: '' });

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Edit user</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              name="firstname"
              value={editedUser.firstname}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={editedUser.lastname}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleChange}
              className="w-full border rounded-xl px-2 py-1"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSave = async (updatedUser: User) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/users/${updatedUser.id}`, updatedUser);
      setUsers(users.map(user => user.id === updatedUser.id ? response.data : user));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]"> {/* Adjusted height */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">First Name</th>
            <th className="py-3 px-4 border-b">Last Name</th>
            <th className="py-3 px-4 border-b">Email</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{user.id}</td>
              <td className="py-3 px-4 border-b">{user.firstname}</td>
              <td className="py-3 px-4 border-b">{user.lastname}</td>
              <td className="py-3 px-4 border-b">{user.email}</td>
              <td className="py-3 px-4 border-b">
                <button
                  onClick={() => handleEdit(user)}
                  className="mr-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <IconEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <IconTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${productId}`);
        setProducts(products.filter(product => product.productId !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_API_URL}/products/${updatedProduct.productId}`, updatedProduct);
      setProducts(products.map(product => product.productId === updatedProduct.productId ? response.data : product));
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Product Name</th>
            <th className="py-3 px-4 border-b">Category</th>
            <th className="py-3 px-4 border-b">Cost</th>
            <th className="py-3 px-4 border-b">Price</th>
            <th className="py-3 px-4 border-b">Stock Level</th>
            <th className="py-3 px-4 border-b">Reorder Level</th>
            <th className="py-3 px-4 border-b">Supplier</th>
            <th className="py-3 px-4 border-b">Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.productId} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{product.productId}</td>
              <td className="py-3 px-4 border-b">{product.productName}</td>
              <td className="py-3 px-4 border-b">{product.category}</td>
              <td className="py-3 px-4 border-b">{product.cost}</td>
              <td className="py-3 px-4 border-b">{product.price}</td>
              <td className="py-3 px-4 border-b">{product.stockLevel}</td>
              <td className="py-3 px-4 border-b">{product.reorderLevel}</td>
              <td className="py-3 px-4 border-b">{product.supplier.supplierName}</td>
              
              <td className="py-3 px-4 border-b">
                <button
                  onClick={() => handleEdit(product)}
                  className="mr-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <IconEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(product.productId)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <IconTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

interface Sales{
  saleId:number;
  quantity:number;
  saleDate:Date;
  totalPrice:number;
  product:Product;
  user: User;
}
export const SalesTable = ()=>{
    const [sales,setSales] = useState<Sales[]>([]);
    useEffect(()=>{
      fetchSales();
    },[])
    const fetchSales = async()=>{
      try{
      const response  = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/sales`);
      setSales(response.data);
      }
      catch(error){
        console.error("Error fetching Sales:",error);
      }
    };
    
    return (
      <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]"> {/* Adjusted height */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Product Name</th>
            <th className="py-3 px-4 border-b">User Name</th>
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b">Quantity</th>
            <th className="py-3 px-4 border-b">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale.saleId} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{sale.saleId}</td>
              <td className="py-3 px-4 border-b">{sale.product.productName}</td>
              <td className="py-3 px-4 border-b">{sale.user.firstname}</td>
              <td className="py-3 px-4 border-b">{new Date(sale.saleDate).toLocaleDateString()}</td>
              <td className="py-3 px-4 border-b">{sale.quantity}</td>
              <td className="py-3 px-4 border-b">{sale.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export const SupplierTable = ()=>{
    const [suppliers,setSuppliers] = useState<Supplier[]>([]);
    useEffect(()=>{
      fetchSuppliers();
    },[])
    const fetchSuppliers = async()=>{
      try{
      const response  = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/suppliers`);
      setSuppliers(response.data);
      }
      catch(error){
        console.error("Error fetching Sales:",error);
      }
    };
    
    return (
      <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]"> {/* Adjusted height */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Supplier Name</th>
            <th className="py-3 px-4 border-b">Contact info</th>
            <th className="py-3 px-4 border-b">Rating</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.supplierId} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{supplier.supplierId}</td>
              <td className="py-3 px-4 border-b">{supplier.supplierName}</td>
              <td className="py-3 px-4 border-b">{supplier.contactInfo}</td>
              <td className="py-3 px-4 border-b">{supplier.performanceRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export const ReviewTable = ()=>{
    const [reviews,setReviews] = useState<Review[]>([]);
    useEffect(()=>{
      fetchReviews();
    },[])
    const fetchReviews = async()=>{
      try{
      const response  = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/reviews`);
      setReviews(response.data);
      }
      catch(error){
        console.error("Error fetching Sales:",error);
      }
    };
    
    return (
      <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]"> {/* Adjusted height */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Product Name</th>
            <th className="py-3 px-4 border-b">User Name</th>
            <th className="py-3 px-4 border-b">Review</th>
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b">Rating</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map(review => (
            <tr key={review.reviewId} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{review.reviewId}</td>
              <td className="py-3 px-4 border-b">{review.product.productName}</td>
              <td className="py-3 px-4 border-b">{review.user.firstname}</td>
              <td className="py-3 px-4 border-b">{review.reviewText}</td>
              <td className="py-3 px-4 border-b">{new Date(review.reviewDate).toLocaleDateString()}</td>
              <td className="py-3 px-4 border-b">{review.sentimentScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}
export const POTable = ()=>{
    const [po,setPo] = useState<PO[]>([]);
    useEffect(()=>{
      fetchPO();
    },[])
    const fetchPO = async()=>{
      try{
      const response  = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/purchase-orders`);
      setPo(response.data);
      }
      catch(error){
        console.error("Error fetching Sales:",error);
      }
    };
    
    return (
      <div className="overflow-auto hide-scrollbar h-[calc(100vh-200px)]"> {/* Adjusted height */}
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-200 sticky top-0">
          <tr>
            <th className="py-3 px-4 border-b">ID</th>
            <th className="py-3 px-4 border-b">Supplier Name</th>
            <th className="py-3 px-4 border-b">Product Name</th>
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b">Status</th>
            <th className="py-3 px-4 border-b">Quantity</th>
            <th className="py-3 px-4 border-b">Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {po.map(pos => (
            <tr key={pos.orderId} className="hover:bg-gray-100">
              <td className="py-3 px-4 border-b">{pos.orderId}</td>
              <td className="py-3 px-4 border-b">{pos.supplier.supplierName}</td>
              <td className="py-3 px-4 border-b">{pos.product.productName}</td>
              <td className="py-3 px-4 border-b">{new Date(pos.orderDate).toLocaleDateString()}</td>
              <td className="py-3 px-4 border-b">{pos.status}</td>
              <td className="py-3 px-4 border-b">{pos.quantity}</td>
              <td className="py-3 px-4 border-b">{pos.total_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    )
}

const Admin: React.FC = () => {
  const tabs: { title: string; value: string; content: JSX.Element }[] = [
    {
      title: "Users",
      value: "users",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Users</p>
          <div className="flex-grow overflow-hidden">
            <UserTable />
          </div>
        </div>
      ),
    },
    {
      title: "Products",
      value: "products",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Products</p>
          <div className="flex-grow overflow-hidden">
            <ProductTable />
          </div>
        </div>
      ),
    },
    {
      title: "Sales",
      value: "sales",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Sales</p>
          <div className="flex-grow overflow-hidden">
            <SalesTable />
          </div>
        </div>
      ),
    },
    {
      title: "Suppliers",
      value: "suppliers",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Suppliers</p>
          <div className="flex-grow overflow-hidden">
            <SupplierTable />
          </div>
        </div>
      ),
    },
    {
      title: "Reviews",
      value: "reviews",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Reviews</p>
          <div className="flex-grow overflow-hidden">
            <ReviewTable />
          </div>
        </div>
      ),
    },
    {
      title: "Purchase Order",
      value: "purchase order",
      content: (
        <div className="w-full h-full rounded-2xl p-6 text-lg text-black bg-white shadow-md flex flex-col">
          <p className="mb-4 font-semibold text-gray-700">Purchase Order</p>
          <div className="flex-grow overflow-hidden">
            <POTable />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden md:h-[calc(100vh-100px)] relative flex flex-col mx-auto w-11/12 items-start justify-start my-5">
      <Tabs tabs={tabs} />
    </div>
  );
};



export default function AdminDash() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const applyTheme = (theme: string) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  };

  const [theme, setTheme] = useState(() => {
    // Get the theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme") || "light";
    // Apply the theme immediately
    applyTheme(savedTheme);
    return savedTheme;
  });

  useEffect(() => {
    // This effect now only handles saving the theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      // Apply the new theme immediately
      applyTheme(newTheme);
      return newTheme;
    });
  };
  const links: Links[] = [
    {
      label: theme === "light" ? "Dark Mode" : "Light Mode",
      icon: theme === "light" ? <IconMoon className="text-neutral-700 dark:text-neutral-200 h-5 w-5" /> : <IconSun className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
      onClick: toggleTheme,
      type: 'button',
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      type: 'link',
    },
    {
      label: "Profile",
      href: "/admin",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      type: 'link',
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      type: 'link',
    },
    {
      label: "Logout",
      icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: (e: any) => {
        e.preventDefault();
        logout();
        navigate("/auth/login");
      },
      type: 'button',
    },
  ];

  const [open, setOpen] = useState<boolean>(false);

  const getAvatar = () => {
    if (user.picture === "none") {
      return (
        <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gray-500 text-white flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    } else {
      return (
        <img
          src={user.picture}
          className="h-7 w-7 flex-shrink-0 rounded-full"
          width={50}
          height={50}
          alt="Avatar"
        />
      );
    }
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full h-screen flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.name,
                href: "#",
                icon: getAvatar(),
                type: 'link',
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Admin/>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        StockSync
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};