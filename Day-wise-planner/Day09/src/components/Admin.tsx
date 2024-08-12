// "use client";

// import React from "react";
// import  ProductTable from "./Tables";
// import { Tabs } from "./ui/tabs";

// interface Tab {
//   title: string;
//   value: string;
//   content: JSX.Element;
// }

// const Admin: React.FC = () => {
//   const tabs: Tab[] = [
//     {
//       title: "Users",
//       value: "users",
//       content: (
//         <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-black bg-gradient-to-br from-gray-100 to-gray-300">
//           <p className="mb-4">Users</p>
//           <UserTable />
//         </div>
//       ),
//     },
//     {
//       title: "Products",
//       value: "products",
//       content: (
//         <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-2xl font-bold text-black bg-gradient-to-br from-gray-100 to-gray-300">
//           <p className="mb-4">Products</p>
//           <ProductTable />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="h-[20rem] md:h-[40rem] perspective-[1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-40">
//       <Tabs tabs={tabs} />
//     </div>
//   );
// };

// export default Admin;
