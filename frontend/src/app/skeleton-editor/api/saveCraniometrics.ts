import { EditSkeletonAPI } from "../skeleton-editor-types";

export async function saveCraniometrics(API_URL_ROOT: string, api: EditSkeletonAPI, specimenId : number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated. Please log in first.");

  if (!specimenId || specimenId < 1) throw new Error("Invalid specimen ID");

  // Helper function to upsert data
  async function saveMeasurements(
    endpoint: string,
    measurements: { metric_name: string; metric_value: number }[]
  ) {
    // Convert to body with dynamic columns
    const body: Record<string, number | string> = {};
    for (const m of measurements) {
      if (m.metric_value !== undefined && !isNaN(m.metric_value)) {
        // Convert metric name to SQL-friendly column
        const col = m.metric_name
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w_]/g, "");
        body[col] = m.metric_value;
      }
    }

    // Upsert
    const saveRes = await fetch(`${API_URL_ROOT}/api/${endpoint}/${specimenId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!saveRes.ok) {
      const err = await saveRes.json();
      throw new Error(err.error || `Failed to save ${endpoint}`);
    }

    console.log(`✅ ${endpoint} POST successful`);
  }

  // --- Save both sets ---
  await saveMeasurements("cranium_measurements", api.metrics_cranium);
  await saveMeasurements("mandible_measurements", api.metrics_mandible);

  return { success: true };
}
