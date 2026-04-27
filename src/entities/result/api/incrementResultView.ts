export async function incrementResultView(id: string): Promise<void> {
  await fetch(`/api/result/${id}/view`, { method: "POST" }).catch(() => {});
}
