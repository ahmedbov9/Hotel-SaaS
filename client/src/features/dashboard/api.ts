import { api } from "@/lib/api/client";
import { DashboardSummary } from "@/types/reports";



export async function getDashboardSummary() {
    return api.get<DashboardSummary >('/reports/dashboard');

}