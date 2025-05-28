import { Album, Home, School, Ticket } from "lucide-react";

export const SidebarItems = {
    navMain: [
        {
            title: "Entidades",
            items: [
                {
                    title: "Início",
                    url: "/",
                    icon: <Home />
                },
                {
                    title: "Escolas",
                    url: "/schools",
                    icon: <School />
                },
                {
                    title: "Álbuns",
                    url: "/albums",
                    icon: <Album />
                }, 
                {
                    title: "Cupons",
                    url: "/cupoms",
                    icon: <Ticket />
                },
            ],
        },
    ],
}