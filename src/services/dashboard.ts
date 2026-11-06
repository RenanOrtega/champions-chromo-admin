import { api } from "@/lib/axios";
import type { Metrics, MetricsPeriod } from "@/types/dashboard";

export async function getMetrics(period?: MetricsPeriod): Promise<Metrics> {
    const params: Record<string, string> = {};
    if (period?.from) params.from = period.from.toISOString();
    if (period?.to) params.to = period.to.toISOString();

    const response = await api.get("/dashboard/metrics", { params });
    return response.data;
}
