import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarItems } from "./app-sidebar-items"
import { Link, useLocation } from "react-router"
import { ModeToggle } from "./mode-toggle"
import { LogOut } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center justify-between">
          <span>Rei das Figurinhas</span>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {SidebarItems.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === subItem.url}
                    >
                      <Link to={subItem.url}>{subItem.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
      <div className="text-sm flex gap-2 items-center justify-between">
          <span>renanortega.dev@gmail.com</span>
          <LogOut />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
