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
import { Link, useLocation, useNavigate } from "react-router"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { LogOut, User } from "lucide-react"
import { Separator } from "./ui/separator"
import { useAuth } from "@/hooks/use-auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-2 items-center justify-between">
          <img src="/logo.png" alt="Rei das Figurinhas" className="h-8" />
          <span className="font-bold">Rei das Figurinhas</span>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <Separator orientation="horizontal" />
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
      <Separator orientation="horizontal" />
      <SidebarFooter>
        {user ? (
          <>
            <span className="text-sm flex gap-3">
              <User />
              <span className="font-bold">{user.username}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-500"
            >
              <LogOut />
              Sair
            </Button>
          </>
        ) : (
          <span className="text-sm text-gray-500">
            Não autenticado
          </span>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
