import { loadAdminData, seedAdminData } from "@/lib/adminTypes";

export function exportAdminBackup(): string {
  const data = loadAdminData() ?? seedAdminData();
  return JSON.stringify(data, null, 2);
}

export function downloadAdminBackup() {
  const json = exportAdminBackup();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `pali-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
