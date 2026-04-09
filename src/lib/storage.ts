import { v4 as uuid } from "uuid";

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

interface Like {
  id: string;
  projectId: string;
  userName: string;
}

// Storage keys
const PROJECTS_KEY = "bon-projects";
const COMMENTS_KEY = "bon-comments";
const LIKES_KEY = "bon-likes";

// Helpers
function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Projects
export function getProjects(): Project[] {
  return load<Project>(PROJECTS_KEY).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): Project | undefined {
  return load<Project>(PROJECTS_KEY).find((p) => p.id === id);
}

export function addProject(data: {
  name: string;
  description?: string;
  techSpec?: string;
  usageGuide?: string;
  status?: Project["status"];
  testUrl?: string | null;
}): Project {
  const projects = load<Project>(PROJECTS_KEY);
  const now = new Date().toISOString();
  const project: Project = {
    id: uuid(),
    name: data.name,
    description: data.description || "",
    techSpec: data.techSpec || "",
    usageGuide: data.usageGuide || "",
    status: data.status || "developing",
    testUrl: data.testUrl || null,
    viewCount: 0,
    likeCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  projects.push(project);
  save(PROJECTS_KEY, projects);
  return project;
}

export function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt">>
): Project | undefined {
  const projects = load<Project>(PROJECTS_KEY);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  projects[idx] = {
    ...projects[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  save(PROJECTS_KEY, projects);
  return projects[idx];
}

export function deleteProject(id: string) {
  const projects = load<Project>(PROJECTS_KEY).filter((p) => p.id !== id);
  save(PROJECTS_KEY, projects);
  // Also delete related comments and likes
  const comments = load<Comment>(COMMENTS_KEY).filter(
    (c) => c.projectId !== id
  );
  save(COMMENTS_KEY, comments);
  const likes = load<Like>(LIKES_KEY).filter((l) => l.projectId !== id);
  save(LIKES_KEY, likes);
}

export function incrementViewCount(id: string) {
  const projects = load<Project>(PROJECTS_KEY);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return;
  projects[idx].viewCount += 1;
  save(PROJECTS_KEY, projects);
}

// Likes
export function isLiked(projectId: string, userName: string): boolean {
  return load<Like>(LIKES_KEY).some(
    (l) => l.projectId === projectId && l.userName === userName
  );
}

export function toggleLike(
  projectId: string,
  userName: string
): { liked: boolean } {
  const likes = load<Like>(LIKES_KEY);
  const idx = likes.findIndex(
    (l) => l.projectId === projectId && l.userName === userName
  );

  const projects = load<Project>(PROJECTS_KEY);
  const pIdx = projects.findIndex((p) => p.id === projectId);

  if (idx >= 0) {
    // Unlike
    likes.splice(idx, 1);
    if (pIdx >= 0) projects[pIdx].likeCount = Math.max(projects[pIdx].likeCount - 1, 0);
    save(LIKES_KEY, likes);
    save(PROJECTS_KEY, projects);
    return { liked: false };
  } else {
    // Like
    likes.push({ id: uuid(), projectId, userName });
    if (pIdx >= 0) projects[pIdx].likeCount += 1;
    save(LIKES_KEY, likes);
    save(PROJECTS_KEY, projects);
    return { liked: true };
  }
}

// Comments
export function getComments(projectId: string): Comment[] {
  return load<Comment>(COMMENTS_KEY)
    .filter((c) => c.projectId === projectId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function addComment(data: {
  projectId: string;
  parentId?: string | null;
  userName: string;
  content: string;
}): Comment {
  const comments = load<Comment>(COMMENTS_KEY);
  const now = new Date().toISOString();

  // Flatten depth > 1
  let parentId = data.parentId || null;
  if (parentId) {
    const parent = comments.find((c) => c.id === parentId);
    if (parent && parent.parentId) {
      parentId = parent.parentId;
    }
  }

  const comment: Comment = {
    id: uuid(),
    projectId: data.projectId,
    parentId,
    userName: data.userName,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  };
  comments.push(comment);
  save(COMMENTS_KEY, comments);
  return comment;
}

export function updateComment(id: string, content: string): Comment | undefined {
  const comments = load<Comment>(COMMENTS_KEY);
  const idx = comments.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  comments[idx].content = content;
  comments[idx].updatedAt = new Date().toISOString();
  save(COMMENTS_KEY, comments);
  return comments[idx];
}

export function deleteComment(id: string) {
  const comments = load<Comment>(COMMENTS_KEY);
  const comment = comments.find((c) => c.id === id);
  let filtered = comments;

  if (comment && !comment.parentId) {
    // Top-level: also delete replies
    filtered = comments.filter((c) => c.id !== id && c.parentId !== id);
  } else {
    filtered = comments.filter((c) => c.id !== id);
  }

  save(COMMENTS_KEY, filtered);
}
