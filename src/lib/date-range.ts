import type { MetricsPeriod } from "@/types/dashboard";

export type PeriodPreset = "all" | "today" | "7d" | "30d" | "month" | "custom";

export type DateRangeValue = {
    preset: PeriodPreset;
    /** Datas no formato yyyy-MM-dd, usadas só no modo personalizado. */
    customFrom: string;
    customTo: string;
};

export const PRESETS: { value: PeriodPreset; label: string }[] = [
    { value: "all", label: "Todo o período" },
    { value: "today", label: "Hoje" },
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "month", label: "Este mês" },
    { value: "custom", label: "Personalizado" },
];

export const DEFAULT_DATE_RANGE: DateRangeValue = { preset: "all", customFrom: "", customTo: "" };

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/** Converte "yyyy-MM-dd" para meia-noite no fuso local. */
const parseInputDate = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const toInputDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const formatShort = (date: Date) => date.toLocaleDateString("pt-BR");

/**
 * Converte a seleção em um período para a API.
 * Retorna null quando o intervalo personalizado ainda está incompleto ou inválido.
 */
export function toMetricsPeriod(value: DateRangeValue): MetricsPeriod | null {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    switch (value.preset) {
        case "all":
            return {};
        case "today":
            return { from: today, to: tomorrow };
        case "7d":
            return { from: addDays(today, -6), to: tomorrow };
        case "30d":
            return { from: addDays(today, -29), to: tomorrow };
        case "month":
            return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: tomorrow };
        case "custom": {
            if (!value.customFrom && !value.customTo) return null;
            const from = value.customFrom ? parseInputDate(value.customFrom) : undefined;
            // A data final é inclusiva na tela, então mandamos o início do dia seguinte
            const to = value.customTo ? addDays(parseInputDate(value.customTo), 1) : undefined;
            if (from && to && from >= to) return null;
            return { from, to };
        }
    }
}

/** Texto curto que descreve o período selecionado. */
export function describePeriod(value: DateRangeValue): string {
    if (value.preset !== "custom") {
        return PRESETS.find(p => p.value === value.preset)?.label ?? "";
    }
    const { customFrom, customTo } = value;
    if (customFrom && customTo) return `${formatShort(parseInputDate(customFrom))} a ${formatShort(parseInputDate(customTo))}`;
    if (customFrom) return `Desde ${formatShort(parseInputDate(customFrom))}`;
    if (customTo) return `Até ${formatShort(parseInputDate(customTo))}`;
    return "Período personalizado";
}

