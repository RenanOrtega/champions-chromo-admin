import { api } from "@/lib/axios";
import type { Metrics } from "@/types/dashboard";

export async function getMetrics(): Promise<Metrics> {
    const response = await api.get("/dashboard/metrics");
    return response.data;
}
