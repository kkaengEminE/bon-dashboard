import { getSupabase } from "./supabase";

// Types
export interface Project {
  id: string;
  name: string;
  description: string;
  techSpec: string;
  usageGuide: string;
  status: "developing" | "testable" | "completed";
  testUrl: string | null;
  viewCount: number;
  likeCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  projectId: string;
  parentId: string | null;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Row mappers (snake_case DB -> camelCase TS)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    techSpec: row.tech_spec,
    usageGuide: row.usage_guide,
    status: row.status,
    testUrl: row.test_url,
    viewCount: row.view_count,
    likeCount: row.like_count,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toComment(row: any): Comment {
  return {
    id: row.id,
    projectId: row.project_id,
    parentId: row.parent_id,
    userName: row.user_name,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjects error:", error);
    return [];
  }
  return (data || []).map(toProject);
}

export async function getProject(id: string): Promise<Project | undefined> {
  const { data, error } = await getSupabase()
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return toProject(data);
}

export async function addProject(data: {
  name: string;
  description?: string;
  techSpec?: string;
  usageGuide?: string;
  status?: Project["status"];
  testUrl?: string | null;
  createdBy?: string;
}): Promise<Project> {
  const { data: row, error } = await getSupabase()
    .from("projects")
    .insert({
      name: data.name,
      description: data.description || "",
      tech_spec: data.techSpec || "",
      usage_guide: data.usageGuide || "",
      status: data.status || "developing",
      test_url: data.testUrl || null,
      created_by: data.createdBy || "",
    })
    .select()
    .single();

  if (error) throw new Error(`addProject error: ${error.message}`);
  return toProject(row);
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Promise<Project | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: any = { updated_at: new Date().toISOString() };
  if (data.name !== undefined) update.name = data.name;
  if (data.description !== undefined) update.description = data.description;
  if (data.techSpec !== undefined) update.tech_spec = data.techSpec;
  if (data.usageGuide !== undefined) update.usage_guide = data.usageGuide;
  if (data.status !== undefined) update.status = data.status;
  if (data.testUrl !== undefined) update.test_url = data.testUrl;
  if (data.createdBy !== undefined) update.created_by = data.createdBy;

  const { data: row, error } = await getSupabase()
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error || !row) return undefined;
  return toProject(row);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await getSupabase().from("projects").delete().eq("id", id);
  if (error) console.error("deleteProject error:", error);
}

export async function incrementViewCount(id: string): Promise<void> {
  const { error } = await getSupabase().rpc("increment_view_count", { p_id: id });
  if (error) console.error("incrementViewCount error:", error);
}

// Likes
export async function isLiked(
  projectId: string,
  userName: string
): Promise<boolean> {
  const { data } = await getSupabase()
    .from("likes")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_name", userName)
    .maybeSingle();

  return !!data;
}

export async function toggleLike(
  projectId: string,
  userName: string
): Promise<{ liked: boolean }> {
  const liked = await isLiked(projectId, userName);

  if (liked) {
    await getSupabase()
      .from("likes")
      .delete()
      .eq("project_id", projectId)
      .eq("user_name", userName);
  } else {
    await getSupabase()
      .from("likes")
      .insert({ project_id: projectId, user_name: userName });
  }

  // Update like_count from actual count
  const { count } = await getSupabase()
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId);

  await getSupabase()
    .from("projects")
    .update({ like_count: count || 0 })
    .eq("id", projectId);

  return { liked: !liked };
}

// Comments
export async function getComments(projectId: string): Promise<Comment[]> {
  const { data, error } = await getSupabase()
    .from("comments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getComments error:", error);
    return [];
  }
  return (data || []).map(toComment);
}

export async function addComment(data: {
  projectId: string;
  parentId?: string | null;
  userName: string;
  content: string;
}): Promise<Comment> {
  // Flatten depth > 1
  let parentId = data.parentId || null;
  if (parentId) {
    const { data: parent } = await getSupabase()
      .from("comments")
      .select("parent_id")
      .eq("id", parentId)
      .single();
    if (parent?.parent_id) {
      parentId = parent.parent_id;
    }
  }

  const { data: row, error } = await getSupabase()
    .from("comments")
    .insert({
      project_id: data.projectId,
      parent_id: parentId,
      user_name: data.userName,
      content: data.content,
    })
    .select()
    .single();

  if (error) throw new Error(`addComment error: ${error.message}`);
  return toComment(row);
}

export async function updateComment(
  id: string,
  content: string
): Promise<Comment | undefined> {
  const { data: row, error } = await getSupabase()
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !row) return undefined;
  return toComment(row);
}

export async function deleteComment(id: string): Promise<void> {
  // CASCADE on parent_id FK handles reply deletion for top-level comments
  const { error } = await getSupabase().from("comments").delete().eq("id", id);
  if (error) console.error("deleteComment error:", error);
}
