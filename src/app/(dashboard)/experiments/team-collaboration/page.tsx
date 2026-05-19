"use client";

import { useMemo, useState } from "react";
import { Check, MailPlus, ShieldCheck, Trash2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  canRemoveMember,
  describeFormAccess,
  PROTOTYPE_FORMS,
  PROTOTYPE_MEMBERS,
  ROLE_LABELS,
  ROLE_SUMMARIES,
  validateInviteEmail,
  type PrototypeMember,
  type PrototypeRole,
} from "./team-collaboration-prototype";

const selectableRoles: PrototypeRole[] = ["admin", "editor", "viewer"];

export default function TeamCollaborationExperimentPage() {
  const [members, setMembers] = useState<PrototypeMember[]>(PROTOTYPE_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<PrototypeRole>("viewer");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [recentAction, setRecentAction] = useState("Invite, role, and removal changes stay local to this prototype.");

  const activeMembers = useMemo(
    () => members.filter((member) => member.status === "active").length,
    [members]
  );
  const pendingInvites = members.length - activeMembers;

  const submitInvite = () => {
    const error = validateInviteEmail(inviteEmail);
    if (error) {
      setInviteError(error);
      return;
    }

    const email = inviteEmail.trim().toLowerCase();
    const localPart = email.split("@")[0] ?? "member";
    const name = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");

    setMembers((current) => [
      ...current,
      {
        id: `invite-${Date.now()}`,
        name: name || email,
        email,
        role: inviteRole,
        status: "pending",
        lastActive: "Invite drafted",
      },
    ]);
    setInviteEmail("");
    setInviteError(null);
    setRecentAction(`Drafted invite for ${email} as ${ROLE_LABELS[inviteRole]}.`);
  };

  const changeRole = (memberId: string, role: PrototypeRole) => {
    setMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, role } : member))
    );
    setRecentAction(`Updated role to ${ROLE_LABELS[role]}.`);
  };

  const removeMember = (memberId: string) => {
    const member = members.find((item) => item.id === memberId);
    if (!member || !canRemoveMember(member)) return;

    setMembers((current) => current.filter((item) => item.id !== memberId));
    setRecentAction(`Removed ${member.name} from the local workspace mock.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge variant="outline" className="mb-3">
            Prototype
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900">Team Collaboration</h1>
          <p className="mt-1 max-w-3xl text-gray-500">
            Calibrate member roles, invites, and form sharing before adding durable team infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{activeMembers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{pendingInvites}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Limit</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">10</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <CardTitle>Workspace Members</CardTitle>
              </div>
              <CardDescription>Fixture data with local-only edits for role and invitation flow testing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-[minmax(0,1fr)_180px_96px]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <Badge variant={member.status === "active" ? "success" : "outline"}>
                        {member.status}
                      </Badge>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">{member.email}</p>
                    <p className="mt-2 text-sm text-gray-600">{ROLE_SUMMARIES[member.role]}</p>
                    <p className="mt-1 text-xs text-gray-400">{member.lastActive}</p>
                  </div>
                  <div>
                    <Label htmlFor={`${member.id}-role`} className="sr-only">
                      Role for {member.name}
                    </Label>
                    <Select
                      id={`${member.id}-role`}
                      value={member.role}
                      onChange={(event) => changeRole(member.id, event.target.value as PrototypeRole)}
                      disabled={member.role === "owner"}
                    >
                      <option value="owner">Owner</option>
                      {selectableRoles.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                    disabled={!canRemoveMember(member)}
                    title={canRemoveMember(member) ? "Remove member" : "Owner cannot be removed"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <CardTitle>Form Sharing Model</CardTitle>
              </div>
              <CardDescription>Test whether role-based sharing is understandable before building permissions.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {PROTOTYPE_FORMS.map((form) => (
                  <div key={form.id} className="grid gap-2 p-4 md:grid-cols-[minmax(0,1fr)_260px]">
                    <div>
                      <p className="font-medium text-gray-900">{form.title}</p>
                      <p className="text-sm text-gray-500">Form-level sharing preview</p>
                    </div>
                    <div className="text-sm text-gray-700">{describeFormAccess(form.sharedWith)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MailPlus className="h-5 w-5 text-indigo-600" />
                <CardTitle>Invite Draft</CardTitle>
              </div>
              <CardDescription>Create a pending invitation in local state.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => {
                    setInviteEmail(event.target.value);
                    setInviteError(null);
                  }}
                  placeholder="teammate@example.com"
                  className="mt-1"
                />
                {inviteError && <p className="mt-2 text-sm text-red-600">{inviteError}</p>}
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as PrototypeRole)}
                  className="mt-1"
                >
                  {selectableRoles.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="button" className="w-full" onClick={submitInvite}>
                <MailPlus className="mr-2 h-4 w-4" />
                Draft Invite
              </Button>
              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{recentAction}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deferred Infrastructure</CardTitle>
              <CardDescription>Evidence needed before promotion to production scope.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-gray-600">
                {[
                  "Team and membership schema",
                  "Invitation tokens and email delivery",
                  "Organization-scoped authorization checks",
                  "Business plan seat enforcement",
                  "Role audit log and member activity",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
