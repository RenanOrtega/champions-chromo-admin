import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router"
import { Separator } from "./ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { SidebarItems } from "./app-sidebar-items"
import React from "react"
import { Toaster } from "sonner"

function generateBreadcrumb(pathname: string) {
    const segments = pathname.split('/').filter(Boolean)

    if (segments.length === 0) {
        return [{ title: "Início", url: "/" }]
    }

    const breadcrumbItems = [
        { title: "Início", url: "/", isLink: true }
    ]

    for (const group of SidebarItems.navMain) {
        for (const item of group.items) {
            if (segments.includes(item.url)) {
                breadcrumbItems.push({
                    title: item.title,
                    url: `/${item.url}`,
                    isLink: false
                })
                break
            }
        }
    }

    return breadcrumbItems
}

export default function Layout() {
    const location = useLocation()
    const breadcrumbItems = generateBreadcrumb(location.pathname)

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbItems.map((item, index) => (
                                <React.Fragment key={item.url}>
                                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                        {"isLink" in item && item.isLink ? (
                                            <BreadcrumbLink href={item.url}>
                                                {item.title}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbItems.length - 1 && (
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <main className="h-full p-10">
                    <Outlet />
                </main>
                <Toaster />
            </SidebarInset>
        </SidebarProvider>
    )
}