import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext, useState } from "react";
import { Link, LinkProps } from "react-router-dom";

interface ButtonLinkProps {
  label: string;
  href?: never; // `href` should not be present for buttons
  icon: React.JSX.Element | React.ReactNode;
  type: 'button';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface AnchorLinkProps {
  label: string;
  href: string; // `href` is required for links
  icon: React.JSX.Element | React.ReactNode;
  type: 'link';
  onClick?: never; // `onClick` should not be present for links
}

export type Links = ButtonLinkProps | AnchorLinkProps;


// Define the structure of the Sidebar Context
interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

// Create a Sidebar Context
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider Component
export const SidebarProvider: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}> = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
  const [openState, setOpenState] = useState<boolean>(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar Component
export const Sidebar: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}> = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// Sidebar Body Component
export const SidebarBody: React.FC<React.ComponentProps<typeof motion.div>> = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

// Desktop Sidebar Component
export const DesktopSidebar: React.FC<React.ComponentProps<typeof motion.div>> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-black w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Mobile Sidebar Component
export const MobileSidebar: React.FC<React.ComponentProps<"div">> = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full",
        className
      )}
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sidebar Link Component
export const SidebarLink: React.FC<{
  link: Links;
  className?: string;
} & Omit<LinkProps, 'to'>> = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();

  const commonClasses = cn(
    "flex items-center justify-start gap-2 group/sidebar py-2",
    className
  );

  if (link.type === 'button') {
    // Render as a button if type is 'button'
    return (
      <button
        className={commonClasses}
        onClick={link.onClick} // Correctly typed onClick
        {...props as React.ButtonHTMLAttributes<HTMLButtonElement>} // Casting for button attributes
      >
        {link.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
        >
          {link.label}
        </motion.span>
      </button>
    );
  }

  // Render as a Link if type is 'link'
  return (
    <Link
      to={link.href}
      className={commonClasses}
      {...props as Omit<LinkProps, 'to'>} // Exclude `to` from spread props
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};