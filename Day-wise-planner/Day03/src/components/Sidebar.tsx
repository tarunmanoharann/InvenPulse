"use client";
import { useUser } from "@/global/useUser";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconMoon,
  IconSettings,
  IconSun,
  IconUserBolt,
} from "@tabler/icons-react";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AreaChartDash from "./ui/area-chart";
import BarChartDash from "./ui/bar-chart";
import ExCard from "./ui/ClickCards";
import InAreaChartDash from "./ui/in-area-chart";
import { PieChartDash } from "./ui/pie-chart";
import { Links, Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";

interface Card {
  description: string;
  title: string;
  ctaText: string;
  ctaLink: string;
  content: string | (() => React.ReactNode);
}

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("theme") || "light";
  }
  return "light";
};

const applyTheme = (theme: string) => {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
};

export default function SidebarDemo() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
      <Dashboard />
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

const Dashboard: React.FC = () => {
  const [saleCount,setSaleCount] = useState(0)
  const [productCount,setProductCount]  =useState(0)
  const [poCount,setPOCount] = useState(0)
  const [supplierCount,setSupplierCount] = useState(0)
  useEffect(()=>{
    const fetchSalesCount = async() =>{
      const count = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/sales/count`)
      setSaleCount(count.data)
    }

    fetchSalesCount()
    const fetchProductCount = async() =>{
      const count = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/products/count`)
      setProductCount(count.data)
    }

    fetchProductCount()
    const fetchPOCount = async() =>{
      const count = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/purchase-orders/count`)
      setPOCount(count.data)
    }

    fetchPOCount()
    const fetchSupplierCount = async() =>{
      const count = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/suppliers/count`)
      setSupplierCount(count.data)
    }

    fetchSupplierCount()
  })
  const cards: Card[] = [
    {
      description: "Total number of sales",
      title: saleCount.toString(),
      ctaText: "View",
      ctaLink: "https://your-link-here.com/sales",
      content: () => (
        <p>
          The total number of sales this month is a key indicator of the business's performance.
          It's crucial to monitor this metric to ensure the business is on track to meet its targets.
          <br />
          <br />
          Monitoring sales trends helps in forecasting and planning for future inventory needs,
          ensuring that popular products are always in stock and slow-moving items are identified.
        </p>
      ),
    },
    {
      description: "Current count of all products",
      title: productCount.toString(),
      ctaText: "View",
      ctaLink: "https://your-link-here.com/inventory",
      content: () => (
        <p>
          Keeping track of current stock levels is essential for inventory management. 
          It helps in maintaining an optimal stock level, reducing the holding cost, and avoiding stockouts or overstock situations.
          <br />
          <br />
          Regularly updating stock information ensures accurate data is available for making informed decisions.
        </p>
      ),
    },
    {
      description: "Number of products reordered",
      title: poCount.toString(),
      ctaText: "View",
      ctaLink: "https://your-link-here.com/reorders",
      content: () => (
        <p>
          Identifying products that need to be reordered helps in maintaining continuous availability of products.
          <br />
          <br />
          Timely reordering prevents stockouts and ensures customer satisfaction by meeting demand without delay.
        </p>
      ),
    },
    {
      description: "Total number of suppliers",
      title: supplierCount.toString(),
      ctaText: "View",
      ctaLink: "https://your-link-here.com/inventory-value",
      content: () => (
        <p>
          The total value of current inventory provides insights into the capital tied up in stock.
          <br />
          <br />
          It helps in evaluating the financial health of the business and planning for future investments.
        </p>
      ),
    },
  ];

  return (
    <div className="h-full w-full overflow-auto p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card, index) => (
          <ExCard key={index} cards={card} />
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols- lg:grid-cols-3 py-4">
       
          <BarChartDash />
        
          <AreaChartDash />
        
          <PieChartDash />
        
      </div>
      <div className="">
        <InAreaChartDash />
      </div>
    </div>
  );
};
