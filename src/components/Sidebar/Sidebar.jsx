import { Typography } from "@mui/material";
import SidebarItem from "./SidebarItem";
import { Icon, IconRaw } from '../Icon';

const MainMenu = [
  { title: "Dashboard", iconName: IconRaw.dashboard },
  { title: "User Management", iconName: IconRaw.people },
  { title: "Consult. & Presp", iconName: IconRaw.personalCard },
  { title: "Pharm. & Orders Mgt", iconName: IconRaw.shop },
  { title: "Payments", iconName: IconRaw.wallet },
];
const AdminMenu = [
  { title: "Settings", iconName: IconRaw.clipboard },
  { title: "Roles & Permission", iconName: IconRaw.personalCard },
  { title: "Activity Log", iconName: IconRaw.task },
  { title: "Blog/Health Tips", iconName: IconRaw.task },
  { title: "Notifications Mgt.", iconName: IconRaw.sms },
  { title: "Website Updates", iconName: IconRaw.receipt },
];

export default function Sidebar({ onClose }) {
  return (
    <div
      className="w-64 h-full bg-gradient-to-b from-[#283C85] to-[#090E1F] overflow-y-auto"
    >
<div className="pl-4">

    <div className="flex justify-left items-center mb-6 pt-4">
        <img src={Icon.logo21} alt="logo" />
    </div>
      <p className="text-white text-xs py-4">Main Menu</p>
      <div className="">
        {MainMenu.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            iconName={item.iconName}
            iconRaw={item.iconName}
            path={`/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            onClose={onClose}
          />
        ))}
      </div>
      <p className="text-white text-xs py-4">Admin Menu</p>
      <div className="">
        {AdminMenu.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            iconName={item.iconName}
            iconRaw={item.iconName}
            path={`/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
            onClose={onClose}
          />
        ))}
      </div>
</div>
    </div>
  );
}
