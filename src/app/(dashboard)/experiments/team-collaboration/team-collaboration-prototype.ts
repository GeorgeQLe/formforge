export type PrototypeRole = "owner" | "admin" | "editor" | "viewer";

export type PrototypeMember = {
  id: string;
  name: string;
  email: string;
  role: PrototypeRole;
  status: "active" | "pending";
  lastActive: string;
};

export type PrototypeFormShare = {
  id: string;
  title: string;
  sharedWith: PrototypeRole[];
};

export const ROLE_LABELS: Record<PrototypeRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_SUMMARIES: Record<PrototypeRole, string> = {
  owner: "Full workspace control, billing, members, and forms",
  admin: "Manage members, forms, responses, and workspace settings",
  editor: "Create and edit forms, themes, and response exports",
  viewer: "View forms, responses, analytics, and exports",
};

export const PROTOTYPE_MEMBERS: PrototypeMember[] = [
  {
    id: "member-owner",
    name: "Avery Chen",
    email: "avery@example.com",
    role: "owner",
    status: "active",
    lastActive: "Now",
  },
  {
    id: "member-admin",
    name: "Morgan Lee",
    email: "morgan@example.com",
    role: "admin",
    status: "active",
    lastActive: "12 min ago",
  },
  {
    id: "member-editor",
    name: "Sam Rivera",
    email: "sam@example.com",
    role: "editor",
    status: "active",
    lastActive: "Yesterday",
  },
  {
    id: "member-pending",
    name: "Taylor Brooks",
    email: "taylor@example.com",
    role: "viewer",
    status: "pending",
    lastActive: "Invite sent",
  },
];

export const PROTOTYPE_FORMS: PrototypeFormShare[] = [
  {
    id: "form-onboarding",
    title: "Customer onboarding",
    sharedWith: ["admin", "editor"],
  },
  {
    id: "form-feedback",
    title: "Quarterly feedback",
    sharedWith: ["admin", "editor", "viewer"],
  },
  {
    id: "form-intake",
    title: "Vendor intake",
    sharedWith: ["owner", "admin"],
  },
];

export function validateInviteEmail(email: string): string | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return "Enter an email address.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function canRemoveMember(member: PrototypeMember): boolean {
  return member.role !== "owner";
}

export function describeFormAccess(roles: PrototypeRole[]): string {
  if (roles.length === 0) {
    return "Private to owner";
  }

  return roles.map((role) => ROLE_LABELS[role]).join(", ");
}
