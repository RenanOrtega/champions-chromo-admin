import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionCard({ title, action, children, className }: {
    title: ReactNode
    action?: ReactNode
    children: ReactNode
    className?: string
}) {
    return (
        <section className={cn("rounded-xl border bg-card", className)}>
            <header className="flex items-center justify-between gap-2 border-b px-5 py-3">
                <h2 className="font-semibold">{title}</h2>
                {action}
            </header>
            <div className="p-5">{children}</div>
        </section>
    );
}
