import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  Users,
  Plus,
  Settings,
  Mail,
  UserPlus,
  X,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Copy,
  Trash2,
  FolderKanban,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SectionHeader from "../../components/dashboard/SectionHeader";
import Modal from "../../components/dashboard/Modal";
import FormInput from "../../components/dashboard/FormInput";
import FormField from "../../components/dashboard/FormField";
import FilterTabs from "../../components/dashboard/FilterTabs";
import SearchInput from "../../components/dashboard/SearchInput";
import { validateZod } from "../../types/settings";

type TeamRole = "owner" | "admin" | "developer" | "viewer";
type TeamPlan = "starter" | "team" | "enterprise";
type MemberStatus = "active" | "invited" | "suspended";
type DetailTab = "overview" | "settings" | "projects";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  joinedAt: string;
}

interface TeamInvite {
  id: string;
  email: string;
  role: TeamRole;
  expiresAt: string;
}

interface TeamProject {
  id: string;
  name: string;
  description: string;
  secretCount: number;
  environmentCount: number;
  assigned: boolean;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  plan: TeamPlan;
  avatarUrl?: string;
  billingEmail?: string;
  subscriptionStatus: string;
  enforce2fa: boolean;
  allowedDomains: string[];
  memberCount: number;
  members: TeamMember[];
  invites: TeamInvite[];
  projects: string[];
  createdAt: string;
}

const MOCK_TEAMS: Team[] = [
  {
    id: "team_1",
    name: "Acme Corp",
    slug: "acme-corp",
    plan: "enterprise",
    billingEmail: "billing@acme.com",
    subscriptionStatus: "active",
    enforce2fa: true,
    allowedDomains: ["acme.com"],
    memberCount: 12,
    createdAt: "2025-09-15",
    projects: ["proj_1", "proj_2"],
    members: [
      { id: "m1", name: "Yasas", email: "yasas@acme.com", role: "owner", status: "active", joinedAt: "Sep 2025" },
      { id: "m2", name: "Alex", email: "alex@acme.com", role: "admin", status: "active", joinedAt: "Oct 2025" },
      { id: "m3", name: "Sam", email: "sam@acme.com", role: "developer", status: "active", joinedAt: "Nov 2025" },
      { id: "m4", name: "Taylor", email: "taylor@acme.com", role: "viewer", status: "active", joinedAt: "Jan 2026" },
    ],
    invites: [
      { id: "i1", email: "jordan@acme.com", role: "developer", expiresAt: "Jul 1, 2026" },
    ],
  },
  {
    id: "team_2",
    name: "Personal",
    slug: "personal",
    plan: "starter",
    subscriptionStatus: "active",
    enforce2fa: false,
    allowedDomains: [],
    memberCount: 1,
    createdAt: "2025-08-01",
    projects: ["proj_3"],
    members: [
      { id: "m5", name: "Yasas", email: "yasas@example.com", role: "owner", status: "active", joinedAt: "Aug 2025" },
    ],
    invites: [],
  },
  {
    id: "team_3",
    name: "Side Project",
    slug: "side-project",
    plan: "team",
    billingEmail: "dev@sideproject.io",
    subscriptionStatus: "trialing",
    enforce2fa: false,
    allowedDomains: ["sideproject.io"],
    memberCount: 4,
    createdAt: "2026-03-10",
    projects: [],
    members: [
      { id: "m6", name: "Yasas", email: "yasas@sideproject.io", role: "admin", status: "active", joinedAt: "Mar 2026" },
      { id: "m7", name: "Riley", email: "riley@sideproject.io", role: "developer", status: "active", joinedAt: "Mar 2026" },
      { id: "m8", name: "Jordan", email: "jordan@sideproject.io", role: "developer", status: "invited", joinedAt: "Apr 2026" },
    ],
    invites: [
      { id: "i2", email: "casey@sideproject.io", role: "viewer", expiresAt: "Jul 5, 2026" },
    ],
  },
];

const ALL_PROJECTS: TeamProject[] = [
  { id: "proj_1", name: "Acme API", description: "Production API server", secretCount: 248, environmentCount: 3, assigned: true },
  { id: "proj_2", name: "Main App", description: "Customer-facing web app", secretCount: 186, environmentCount: 3, assigned: true },
  { id: "proj_3", name: "Mobile Backend", description: "iOS/Android API gateway", secretCount: 94, environmentCount: 2, assigned: true },
  { id: "proj_4", name: "Data Pipeline", description: "ETL and analytics infra", secretCount: 312, environmentCount: 2, assigned: false },
  { id: "proj_5", name: "Admin Dashboard", description: "Internal admin panel", secretCount: 67, environmentCount: 3, assigned: false },
  { id: "proj_6", name: "Documentation", description: "Developer docs site", secretCount: 12, environmentCount: 1, assigned: false },
];

const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name must be at most 100 characters"),
  slug: z.string().trim().min(1, "Slug is required").max(100, "Slug must be at most 100 characters"),
});

const updateTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name must be at most 100 characters"),
  slug: z.string().trim().min(1, "Slug is required").max(100, "Slug must be at most 100 characters"),
  billingEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

const roleStyles: Record<TeamRole, string> = {
  owner: "bg-[#FF9F0A]/10 text-[#FF9F0A]",
  admin: "bg-[#007AFF]/10 text-[#007AFF]",
  developer: "bg-[#30D158]/10 text-[#30D158]",
  viewer: "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]",
};

const planStyles: Record<TeamPlan, string> = {
  starter: "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]",
  team: "bg-[#007AFF]/10 text-[#007AFF]",
  enterprise: "bg-[#1A1A1A]/10 dark:bg-white/10 text-[#1A1A1A] dark:text-[#E5E5E5]",
};

function RoleBadge({ role }: { role: TeamRole }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${roleStyles[role]}`}>{role}</span>
  );
}

function PlanBadge({ plan }: { plan: TeamPlan }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${planStyles[plan]}`}>{plan}</span>
  );
}

function TeamCard({ team, onSelect, onDelete }: { team: Team; onSelect: () => void; onDelete: () => void }) {
  return (
    <DashboardCard hover padding="md" className="cursor-pointer" onClick={onSelect}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#8E8E93]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{team.name}</h3>
            <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{team.slug}</p>
          </div>
        </div>
        <PlanBadge plan={team.plan} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
          <Users className="w-3.5 h-3.5" />{team.memberCount} {team.memberCount === 1 ? "member" : "members"}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
          <FolderKanban className="w-3.5 h-3.5" />{team.projects.length} projects
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
        <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Created {team.createdAt}</span>
        <DashboardButton onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-[11px] text-[#FF3B30] hover:text-[#FF3B30]/80 font-medium">Delete</DashboardButton>
      </div>
    </DashboardCard>
  );
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createPlan, setCreatePlan] = useState<TeamPlan>("starter");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState<TeamRole>("developer");
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [enforce2fa, setEnforce2fa] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");

  const createFormik = useFormik({
    initialValues: { name: "", slug: "" },
    validate: validateZod(createTeamSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: values.name,
        slug: values.slug,
        plan: createPlan,
        subscriptionStatus: "active",
        enforce2fa: false,
        allowedDomains: [],
        memberCount: 1,
        createdAt: new Date().toISOString().split("T")[0],
        projects: [],
        members: [{ id: "m_owner", name: "You", email: "user@example.com", role: "owner", status: "active", joinedAt: "Just now" }],
        invites: [],
      };
      setTeams((prev) => [...prev, newTeam]);
      setSubmitting(false);
      setShowCreateModal(false);
      resetForm();
      setCreatePlan("starter");
    },
  });

  const inviteFormik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(inviteMemberSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (!selectedTeam) return;
      const newInvite: TeamInvite = { id: `inv_${Date.now()}`, email: values.email, role: inviteRole, expiresAt: "30 days" };
      setTeams((prev) => prev.map((t) => t.id === selectedTeam.id ? { ...t, invites: [...t.invites, newInvite] } : t));
      setSelectedTeam((prev) => prev ? { ...prev, invites: [...prev.invites, newInvite] } : null);
      setSubmitting(false);
      setShowInviteModal(false);
      resetForm();
      setInviteRole("developer");
    },
  });

  const settingsFormik = useFormik({
    initialValues: { name: "", slug: "", billingEmail: "" },
    validate: validateZod(updateTeamSchema),
    onSubmit: (values, { setSubmitting }) => {
      if (!selectedTeam) return;
      const updated: Team = {
        ...selectedTeam,
        name: values.name,
        slug: values.slug,
        billingEmail: values.billingEmail || undefined,
        enforce2fa: enforce2fa,
      };
      setTeams((prev) => prev.map((t) => t.id === selectedTeam.id ? updated : t));
      setSelectedTeam(updated);
      setSubmitting(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    },
  });

  function openSettingsForm() {
    if (!selectedTeam) return;
    settingsFormik.setValues({ name: selectedTeam.name, slug: selectedTeam.slug, billingEmail: selectedTeam.billingEmail || "" });
    setEnforce2fa(selectedTeam.enforce2fa);
    setSettingsSaved(false);
    setDetailTab("settings");
  }

  function handleDeleteTeamConfirm() {
    if (!deleteTeamId) return;
    setTeams((prev) => prev.filter((t) => t.id !== deleteTeamId));
    setSelectedTeam(null);
    setDeleteTeamId(null);
    setShowDeleteTeamModal(false);
    setDetailTab("overview");
  }

  function handleRemoveMember(memberId: string) {
    if (!selectedTeam) return;
    const updated = { ...selectedTeam, members: selectedTeam.members.filter((m) => m.id !== memberId), memberCount: selectedTeam.memberCount - 1 };
    setTeams((prev) => prev.map((t) => t.id === selectedTeam.id ? updated : t));
    setSelectedTeam(updated);
  }

  function handleRevokeInvite(inviteId: string) {
    if (!selectedTeam) return;
    const updated = { ...selectedTeam, invites: selectedTeam.invites.filter((i) => i.id !== inviteId) };
    setTeams((prev) => prev.map((t) => t.id === selectedTeam.id ? updated : t));
    setSelectedTeam(updated);
  }

  function handleToggleProject(projectId: string) {
    if (!selectedTeam) return;
    const hasProject = selectedTeam.projects.includes(projectId);
    const updatedProjects = hasProject
      ? selectedTeam.projects.filter((id) => id !== projectId)
      : [...selectedTeam.projects, projectId];
    const updated = { ...selectedTeam, projects: updatedProjects };
    setTeams((prev) => prev.map((t) => t.id === selectedTeam.id ? updated : t));
    setSelectedTeam(updated);
  }

  const detailTabs = [
    { label: "Overview", value: "overview" as DetailTab },
    { label: "Projects", value: "projects" as DetailTab },
    { label: "Settings", value: "settings" as DetailTab },
  ];

  const teamDetail = selectedTeam ? (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-5">
        <DashboardButton onClick={() => { setSelectedTeam(null); setDetailTab("overview"); }} className="p-2 rounded-xl text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.name}</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedTeam.slug} · {selectedTeam.plan} plan</p>
        </div>
        <DashboardButton onClick={() => { setDeleteTeamId(selectedTeam.id); setShowDeleteTeamModal(true); }} className="h-9 px-4 text-sm font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-xl hover:bg-[#FF3B30]/20">
          <Trash2 className="w-4 h-4" />Delete Team
        </DashboardButton>
      </div>

      <FilterTabs options={detailTabs.map((t) => t.label)} value={detailTabs.find((t) => t.value === detailTab)?.label || "Overview"} onChange={(v) => setDetailTab(detailTabs.find((t) => t.label === v)?.value || "overview")} />

      <div className="mt-6">
        {detailTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-6">
              <DashboardCard>
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader title="Team Information" description="Manage your team settings and preferences." />
                  <DashboardButton onClick={openSettingsForm} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222]">
                    <Settings className="w-3.5 h-3.5" />Edit
                  </DashboardButton>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Name</p><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.name}</p></div>
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Slug</p><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.slug}</p></div>
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Plan</p><PlanBadge plan={selectedTeam.plan} /></div>
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Billing Email</p><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.billingEmail || "—"}</p></div>
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Subscription</p><span className="text-[11px] text-[#30D158] font-medium">Active</span></div>
                  <div><p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Enforce 2FA</p><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.enforce2fa ? "Enabled" : "Disabled"}</p></div>
                </div>
                <div className="mt-5 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-2">Allowed Domains</p>
                  {selectedTeam.allowedDomains.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">{selectedTeam.allowedDomains.map((d) => (<span key={d} className="text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-md">{d}</span>))}</div>
                  ) : <p className="text-sm text-[#8E8E93] dark:text-[#666]">No domains restricted</p>}
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex items-center justify-between mb-5">
                  <SectionHeader title="Members" description={`${selectedTeam.members.length} members in this team.`} />
                  <DashboardButton onClick={() => setShowInviteModal(true)} className="h-8 px-3 text-xs font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                    <UserPlus className="w-3.5 h-3.5" />Invite
                  </DashboardButton>
                </div>
                <div className="space-y-1">
                  {selectedTeam.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-[#8E8E93] flex-shrink-0">{m.name.charAt(0)}</div>
                        <div className="min-w-0"><p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{m.name}</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{m.email}</p></div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={m.role} />
                        <span className="text-[11px] text-[#8E8E93] dark:text-[#666] hidden sm:inline">{m.joinedAt}</span>
                        {m.role !== "owner" && <DashboardButton onClick={() => handleRemoveMember(m.id)} className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10"><X className="w-3.5 h-3.5" /></DashboardButton>}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              {selectedTeam.invites.length > 0 && (
                <DashboardCard>
                  <SectionHeader title="Pending Invites" description={`${selectedTeam.invites.length} pending invitation${selectedTeam.invites.length > 1 ? "s" : ""}.`} />
                  <div className="space-y-1">
                    {selectedTeam.invites.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                        <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#8E8E93]" /><div><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{inv.email}</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666]">Expires {inv.expiresAt}</p></div></div>
                        <div className="flex items-center gap-2"><RoleBadge role={inv.role} /><DashboardButton onClick={() => handleRevokeInvite(inv.id)} className="text-[11px] text-[#FF3B30] hover:text-[#FF3B30]/80 font-medium">Revoke</DashboardButton></div>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              )}
            </div>

            <div className="xl:col-span-1 flex flex-col gap-6">
              <DashboardCard>
                <SectionHeader title="Quick Actions" />
                <div className="space-y-2">
                  <DashboardButton onClick={openSettingsForm} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Settings className="w-4 h-4" />Team Settings</DashboardButton>
                  <DashboardButton className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Copy className="w-4 h-4" />Copy Invite Link</DashboardButton>
                  <DashboardButton onClick={() => setDetailTab("projects")} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><FolderKanban className="w-4 h-4" />View Projects</DashboardButton>
                </div>
              </DashboardCard>
              <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
                <SectionHeader title="Danger Zone" />
                <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4"><AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Team</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Permanently delete this team and all its data.</p></div></div>
                <DashboardButton onClick={() => { setDeleteTeamId(selectedTeam.id); setShowDeleteTeamModal(true); }} className="w-full h-9 text-sm font-medium text-white bg-[#FF3B30] rounded-xl hover:bg-[#FF3B30]/90"><Trash2 className="w-4 h-4" />Delete Team</DashboardButton>
              </DashboardCard>
            </div>
          </div>
        )}

        {detailTab === "settings" && (
          <div className="max-w-2xl">
            <DashboardCard>
              <SectionHeader title="Team Settings" description="Modify your team details and preferences." />
              <form onSubmit={settingsFormik.handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField label="Team Name" name="name" placeholder="e.g. Acme Corp" value={settingsFormik.values.name} onChange={(v) => settingsFormik.setFieldValue("name", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined} touched={!!settingsFormik.touched.name} required />
                  <FormField label="Slug" name="slug" placeholder="e.g. acme-corp" value={settingsFormik.values.slug} onChange={(v) => settingsFormik.setFieldValue("slug", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.slug ? settingsFormik.errors.slug : undefined} touched={!!settingsFormik.touched.slug} required />
                  <FormField label="Billing Email" name="billingEmail" type="email" placeholder="billing@company.com" value={settingsFormik.values.billingEmail} onChange={(v) => settingsFormik.setFieldValue("billingEmail", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.billingEmail ? settingsFormik.errors.billingEmail : undefined} touched={!!settingsFormik.touched.billingEmail} />
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5">Plan</label>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]"><PlanBadge plan={selectedTeam.plan} /></p>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div><p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Enforce Two-Factor Authentication</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Require all members to enable 2FA.</p></div>
                    <DashboardButton onClick={() => setEnforce2fa(!enforce2fa)} className="text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]">{enforce2fa ? <ToggleRight className="w-6 h-6 text-[#30D158]" /> : <ToggleLeft className="w-6 h-6" />}</DashboardButton>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5">Allowed Domains</label>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mb-2">Domains comma separated (e.g. acme.com, example.com)</p>
                    <FormInput value={selectedTeam.allowedDomains.join(", ")} onChange={() => {}} placeholder="acme.com, example.com" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  <DashboardButton type="submit" disabled={settingsFormik.isSubmitting} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed">
                    {settingsFormik.isSubmitting ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </DashboardButton>
                  {settingsSaved && <span className="flex items-center gap-1.5 text-[11px] text-[#30D158] font-medium"><CheckCircle className="w-3.5 h-3.5" />Saved successfully</span>}
                </div>
              </form>
            </DashboardCard>
          </div>
        )}

        {detailTab === "projects" && (
          <DashboardCard>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <SectionHeader title="Projects" description={`${selectedTeam.projects.length} projects assigned to this team.`} />
              </div>
              <SearchInput value={projectSearch} onChange={setProjectSearch} placeholder="Search projects..." className="max-w-[260px]" />
            </div>
            <div className="space-y-1">
              {ALL_PROJECTS.filter((proj) =>
                proj.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                proj.description.toLowerCase().includes(projectSearch.toLowerCase())
              ).map((proj) => {
                const assigned = selectedTeam.projects.includes(proj.id);
                return (
                  <div key={proj.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <FolderKanban className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{proj.name}</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{proj.description} · {proj.secretCount} secrets · {proj.environmentCount} envs</p>
                      </div>
                    </div>
                    <DashboardButton
                      onClick={() => handleToggleProject(proj.id)}
                      className={`h-8 px-3 text-xs font-medium rounded-xl ${
                        assigned
                          ? "bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                          : "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {assigned ? "Remove" : "Assign"}
                    </DashboardButton>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        )}
      </div>

      <Modal open={showInviteModal} onClose={() => { setShowInviteModal(false); inviteFormik.resetForm(); }} title="Invite Member" description="Send an invitation to join this team." submitLabel="Send Invite" submitDisabled={inviteFormik.isSubmitting} loading={inviteFormik.isSubmitting} onSubmit={() => inviteFormik.handleSubmit()}>
        <div className="space-y-4">
          <FormField label="Email Address" name="inviteEmail" type="email" placeholder="colleague@company.com" value={inviteFormik.values.email} onChange={(v) => inviteFormik.setFieldValue("email", v)} onBlur={inviteFormik.handleBlur} error={inviteFormik.touched.email ? inviteFormik.errors.email : undefined} touched={!!inviteFormik.touched.email} required />
          <div>
            <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Role</label>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as TeamRole)} className="w-full h-10 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-[#222] rounded-xl px-3 text-[#1D1D1F] dark:text-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-black/[0.08] dark:focus:ring-white/[0.08] transition-all duration-200">
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  ) : null;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      {teamDetail || (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Teams</h1>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{teams.length} teams · Manage your teams and members</p>
            </div>
            <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"><Plus className="w-4 h-4" />Create Team</DashboardButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} onSelect={() => { setSelectedTeam(team); setDetailTab("overview"); settingsFormik.resetForm(); }} onDelete={() => { setDeleteTeamId(team.id); setShowDeleteTeamModal(true); }} />
            ))}
          </div>
        </>
      )}

      <Modal open={showCreateModal} onClose={() => { setShowCreateModal(false); createFormik.resetForm(); setCreatePlan("starter"); }} title="Create Team" description="Set up a new team to collaborate on secrets." submitLabel="Create Team" submitDisabled={createFormik.isSubmitting} loading={createFormik.isSubmitting} onSubmit={() => createFormik.handleSubmit()}>
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Team Name</label>
              <FormInput value={createFormik.values.name} onChange={(v) => createFormik.setFieldValue("name", v)} onBlur={createFormik.handleBlur} placeholder="e.g. Acme Corp" error={createFormik.touched.name ? createFormik.errors.name : undefined} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Slug</label>
              <FormInput value={createFormik.values.slug} onChange={(v) => createFormik.setFieldValue("slug", v)} onBlur={createFormik.handleBlur} placeholder="e.g. acme-corp" error={createFormik.touched.slug ? createFormik.errors.slug : undefined} />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Plan</label>
              <select value={createPlan} onChange={(e) => setCreatePlan(e.target.value as TeamPlan)} className="w-full h-10 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-[#222] rounded-xl px-3 text-[#1D1D1F] dark:text-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-black/[0.08] dark:focus:ring-white/[0.08] transition-all duration-200">
                <option value="starter">Starter</option>
                <option value="team">Team</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <Modal open={showDeleteTeamModal} onClose={() => { setShowDeleteTeamModal(false); }} title="Delete Team" description="This action is permanent and cannot be undone." submitLabel="Permanently Delete" submitDisabled={false} onSubmit={() => { setShowDeleteTeamModal(false); handleDeleteTeamConfirm(); }} className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
        <div className="p-3 bg-[#FF3B30]/5 rounded-xl">
          <p className="text-[11px] text-[#8E8E93] dark:text-[#666] leading-relaxed">All team data will be permanently deleted, including projects, secrets, and member associations. This cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
