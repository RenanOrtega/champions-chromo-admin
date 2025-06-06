import type { StickersOrder } from "@/types/order"
import { Badge } from "./ui/badge"

export const getTypeBadgeColor = (type: StickersOrder["type"]) => {
    switch (type) {
        case "a4":
            return "bg-blue-200 text-blue-600 dark:text-white dark:bg-blue-500"
        case "common":
            return "bg-orange-200 text-orange-600 dark:text-white dark:bg-orange-500"
        case "legend":
            return "bg-purple-200 text-purple-600 dark:text-white dark:bg-purple-500"
        default:
            return "bg-yellow-500"
    }
}

const typeLabelMap: Record<StickersOrder["type"], string> = {
    a4: "A4",
    legend: "Legend",
    common: "Comum"
}

export function BadgeStickerType({ type }: {type : 'a4' | 'legend' | 'common'}) {
    return (
        <Badge className={`${getTypeBadgeColor(type)} text-xs`}>
            {typeLabelMap[type]}
        </Badge>
    )
}