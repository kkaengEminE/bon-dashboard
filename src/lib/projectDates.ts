/** A project starts with its registration time and advances on content updates. */
export function projectUpdatedAt(project: { updatedAt?: string | null; createdAt?: string | null }): string | null {
  for (const value of [project.updatedAt, project.createdAt]) {
    if (value && Number.isFinite(Date.parse(value))) return value;
  }
  return null;
}
