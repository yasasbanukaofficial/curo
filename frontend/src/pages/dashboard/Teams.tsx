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
  KeyRound,
  Layers3,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SectionHeader from "../../components/dashboard/SectionHeader";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import FormInput from "../../components/dashboard/FormInput";
import FormField from "../../components/dashboard/FormField";
import FormSelect from "../../components/dashboard/FormSelect";
import FilterTabs from "../../components/dashboard/FilterTabs";
import SearchInput from "../../components/dashboard/SearchInput";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import {
  useGetTeamsQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
} from "../../features/team/teamApi";
import { useGetProjectsQuery } from "../../features/project/projectApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedTeam, selectSelectedTeam } from "../../features/team/teamSlice";

type TeamRole = "owner" | "admin" | "developer" | "viewer";
type TeamPlan = "starter" | "team" | "enterprise";
type MemberStatus = "active" | "invited" | "suspended";
type DetailTab = "overview" | "settings" | "projects";

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

function TeamCard({ team, onSelect, onDelete }: { team: { _id: string; name: string; slug: string; plan: TeamPlan; memberCount: number; projects: string[]; createdAt: string }; onSelect: () => void; onDelete: () => void }) {
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
          <FolderKanban className="w-3.5 h-3.5" />{(team.projects ?? []).length} projects
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
        <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Created {team.createdAt}</span>
        <DashboardButton onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-[11px] text-[#FF3B30] hover:text-[#FF3B30]/80 font-medium">Delete</DashboardButton>
      </div>
    </DashboardCard>
  );
}

const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name must be at most 100 characters"),
  slug: z.string().trim().min(1, "Slug is required").max(100, "Slug must be at most 100 characters"),
  billingEmail: z.string().email("Invalid billing email").optional().or(z.literal("")),
  allowedDomains: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const domains = val.split(",").map((d) => d.trim()).filter(Boolean);
        if (domains.length === 0) return true;
        return domains.every((d) => /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(d));
      },
      { message: "One or more domains are invalid (e.g. example.com)" },
    ),
});

const updateTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name must be at most 100 characters"),
  slug: z.string().trim().min(1, "Slug is required").max(100, "Slug must be at most 100 characters"),
  billingEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
});

const emailSchema = z.string().email("Invalid email address").trim().toLowerCase();

const detailTabs = [
  { label: "Overview", value: "overview" as DetailTab },
  { label: "Projects", value: "projects" as DetailTab },
  { label: "Settings", value: "settings" as DetailTab },
];

export default function Teams() {
  const dispatch = useAppDispatch();
  const selectedTeam = useAppSelector(selectSelectedTeam);
  const toast = useToast();
  const { data: teams = [], isLoading, isError } = useGetTeamsQuery();
  const [addTeam] = useAddTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [removeTeam] = useRemoveTeamMutation();
  const { data: allProjects = [] } = useGetProjectsQuery();
  const teamProjects = selectedTeam
    ? allProjects.filter((p) => (selectedTeam.projects ?? []).includes(p._id))
    : [];
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createPlan, setCreatePlan] = useState<TeamPlan>("starter");
  const [createMemberEmail, setCreateMemberEmail] = useState("");
  const [createMemberRole, setCreateMemberRole] = useState<TeamRole>("developer");
  const [createMemberError, setCreateMemberError] = useState("");
  const [createMembers, setCreateMembers] = useState<{ email: string; role: TeamRole }[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRole, setInviteRole] = useState<TeamRole>("developer");
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [confirmMemberRemove, setConfirmMemberRemove] = useState<string | null>(null);
  const [confirmInviteRevoke, setConfirmInviteRevoke] = useState<string | null>(null);
  const [enforce2fa, setEnforce2fa] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");

  const createFormik = useFormik({
    initialValues: { name: "", slug: "", billingEmail: "", allowedDomains: "" },
    validate: validateZod(createTeamSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await addTeam({
          name: values.name,
          slug: values.slug,
          billingEmail: values.billingEmail || undefined,
          allowedDomains: values.allowedDomains ? values.allowedDomains.split(",").map((d) => d.trim()).filter(Boolean) : [],
          plan: createPlan,
        }).unwrap();
        setSubmitting(false);
        setShowCreateModal(false);
        resetForm();
        setCreatePlan("starter");
        setCreateMembers([]);
        setCreateMemberEmail("");
        setCreateMemberRole("developer");
        toast.success("Team created", `${values.name} has been created.`);
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to create team", err?.data?.msg || "Something went wrong. Please try again.");
      }
    },
  });

  const inviteFormik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(inviteMemberSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (!selectedTeam) return;
      const newInvite = { id: `inv_${Date.now()}`, email: values.email, role: inviteRole, expiresAt: "30 days" };
      const updated = { ...selectedTeam, invites: [...(selectedTeam.invites || []), newInvite] };
      dispatch(setSelectedTeam(updated));
      setSubmitting(false);
      setShowInviteModal(false);
      resetForm();
      setInviteRole("developer");
    },
  });

  const settingsFormik = useFormik({
    initialValues: { name: "", slug: "", billingEmail: "" },
    validate: validateZod(updateTeamSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedTeam) return;
      try {
        await updateTeam({
          id: selectedTeam._id,
          body: { name: values.name, slug: values.slug, billingEmail: values.billingEmail || undefined, enforce2fa },
        }).unwrap();
        setSubmitting(false);
        toast.success("Settings saved", "Team settings have been updated successfully.");
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to update team", err?.data?.msg || "Something went wrong. Please try again.");
      }
    },
  });

  function openSettingsForm() {
    if (!selectedTeam) return;
    settingsFormik.setValues({ name: selectedTeam.name, slug: selectedTeam.slug, billingEmail: selectedTeam.billingEmail || "" });
    setEnforce2fa(selectedTeam.enforce2fa);
    setDetailTab("settings");
  }

  async function handleDeleteTeamConfirm() {
    if (!deleteTeamId) return;
    try {
      await removeTeam(deleteTeamId).unwrap();
      dispatch(setSelectedTeam(null));
      setDeleteTeamId(null);
      setShowDeleteTeamModal(false);
      setDetailTab("overview");
      toast.success("Team deleted", "The team has been removed.");
    } catch (err: any) {
      toast.error("Failed to delete team", err?.data?.msg || "Something went wrong. Please try again.");
    }
  }

  function handleRemoveMember(memberId: string) {
    setConfirmMemberRemove(memberId);
  }

  function confirmRemoveMember() {
    if (!selectedTeam || !confirmMemberRemove) return;
    const updated = { ...selectedTeam, members: (selectedTeam.members ?? []).filter((m) => m._id !== confirmMemberRemove), memberCount: selectedTeam.memberCount - 1 };
    dispatch(setSelectedTeam(updated));
    setConfirmMemberRemove(null);
    toast.success("Member removed", "Team member has been removed successfully.");
  }

  function handleRevokeInvite(inviteId: string) {
    setConfirmInviteRevoke(inviteId);
  }

  function confirmRevokeInvite() {
    if (!selectedTeam || !confirmInviteRevoke) return;
    const updated = { ...selectedTeam, invites: (selectedTeam.invites ?? []).filter((i) => i._id !== confirmInviteRevoke) };
    dispatch(setSelectedTeam(updated));
    setConfirmInviteRevoke(null);
    toast.success("Invite revoked", "The invitation has been revoked.");
  }

  function handleToggleProject(projectId: string) {
    if (!selectedTeam) return;
    const hasProject = (selectedTeam.projects ?? []).includes(projectId);
    const updatedProjects = hasProject
      ? (selectedTeam.projects ?? []).filter((id) => id !== projectId)
      : [...(selectedTeam.projects ?? []), projectId];
    const updated = { ...selectedTeam, projects: updatedProjects };
    dispatch(setSelectedTeam(updated));
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#8E8E93]">Loading teams...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#FF3B30]">Something went wrong. Could not load teams.</p>
      </div>
    );
  }

  const teamDetail = selectedTeam ? (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-5">
        <DashboardButton onClick={() => { dispatch(setSelectedTeam(null)); setDetailTab("overview"); }} className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedTeam.name}</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedTeam.slug} · {selectedTeam.plan} plan</p>
        </div>
        <DashboardButton onClick={() => { setDeleteTeamId(selectedTeam._id); setShowDeleteTeamModal(true); }} className="h-9 px-4 text-sm font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-[10px] hover:bg-[#FF3B30]/20">
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
                  <DashboardButton onClick={openSettingsForm} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
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
                  {(selectedTeam.allowedDomains ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">{(selectedTeam.allowedDomains ?? []).map((d) => (<span key={d} className="text-[11px] font-medium text-[#007AFF] bg-[#007AFF]/10 px-2 py-0.5 rounded-md">{d}</span>))}</div>
                  ) : <p className="text-sm text-[#8E8E93] dark:text-[#666]">No domains restricted</p>}
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex items-center justify-between mb-5">
                  <SectionHeader title="Members" description={`${(selectedTeam.members ?? []).length} members in this team.`} />
                  <DashboardButton onClick={() => setShowInviteModal(true)} className="h-8 px-3 text-xs font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                    <UserPlus className="w-3.5 h-3.5" />Invite
                  </DashboardButton>
                </div>
                <div className="space-y-1">
                  {(selectedTeam.members ?? []).map((m: any) => (
                    <div key={m._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-[#8E8E93] flex-shrink-0">{m.name?.charAt(0) || "?"}</div>
                        <div className="min-w-0"><p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{m.name}</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{m.email}</p></div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={m.role} />
                        <span className="text-[11px] text-[#8E8E93] dark:text-[#666] hidden sm:inline">{m.joinedAt}</span>
                        {m.role !== "owner" && <DashboardButton onClick={() => handleRemoveMember(m._id)} className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10"><X className="w-3.5 h-3.5" /></DashboardButton>}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>

              {selectedTeam.invites && selectedTeam.invites.length > 0 && (
                <DashboardCard>
                  <SectionHeader title="Pending Invites" description={`${selectedTeam.invites.length} pending invitation${selectedTeam.invites.length > 1 ? "s" : ""}.`} />
                  <div className="space-y-1">
                    {selectedTeam.invites.map((inv: any) => (
                      <div key={inv._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                        <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#8E8E93]" /><div><p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{inv.email}</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666]">Expires {inv.expiresAt}</p></div></div>
                        <div className="flex items-center gap-2"><RoleBadge role={inv.role} /><DashboardButton onClick={() => handleRevokeInvite(inv._id)} className="text-[11px] text-[#FF3B30] hover:text-[#FF3B30]/80 font-medium">Revoke</DashboardButton></div>
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
                  <DashboardButton onClick={openSettingsForm} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Settings className="w-4 h-4" />Team Settings</DashboardButton>
                  <DashboardButton className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Copy className="w-4 h-4" />Copy Invite Link</DashboardButton>
                  <DashboardButton onClick={() => setDetailTab("projects")} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><FolderKanban className="w-4 h-4" />View Projects</DashboardButton>
                </div>
              </DashboardCard>
              <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
                <SectionHeader title="Danger Zone" />
                <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4"><AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Team</p><p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Permanently delete this team and all its data.</p></div></div>
                <DashboardButton onClick={() => { setDeleteTeamId(selectedTeam._id); setShowDeleteTeamModal(true); }} className="w-full h-9 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90"><Trash2 className="w-4 h-4" />Delete Team</DashboardButton>
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
                    <FormInput value={(selectedTeam.allowedDomains ?? []).join(", ")} onChange={() => {}} placeholder="acme.com, example.com" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  <DashboardButton type="submit" disabled={settingsFormik.isSubmitting} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed">
                    {settingsFormik.isSubmitting ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </DashboardButton>
                </div>
              </form>
            </DashboardCard>
          </div>
        )}

        {detailTab === "projects" && (
          <DashboardCard>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <SectionHeader title="Projects" description={`${teamProjects.length} projects assigned to this team.`} />
              </div>
              <SearchInput value={projectSearch} onChange={setProjectSearch} placeholder="Search projects..." className="max-w-[260px]" />
            </div>
            <div className="space-y-1">
              {teamProjects.length === 0 ? (
                <p className="text-sm text-[#8E8E93] dark:text-[#666] py-4 text-center">No projects assigned to this team.</p>
              ) : (
                teamProjects
                  .filter((p) =>
                    p.projectName.toLowerCase().includes(projectSearch.toLowerCase()) ||
                    p.description.toLowerCase().includes(projectSearch.toLowerCase())
                  )
                  .map((p) => (
                    <div key={p._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-[#8E8E93] flex-shrink-0">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{p.projectName}</p>
                          <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{p.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="flex items-center gap-1 text-[11px] text-[#8E8E93] dark:text-[#666]">
                          <KeyRound className="w-3 h-3" />{p.secretCount}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-[#8E8E93] dark:text-[#666]">
                          <Layers3 className="w-3 h-3" />{p.environmentCount}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </DashboardCard>
        )}
      </div>

      <Modal open={showInviteModal} onClose={() => { setShowInviteModal(false); inviteFormik.resetForm(); }} title="Invite Member" description="Send an invitation to join this team." submitLabel="Send Invite" submitDisabled={inviteFormik.isSubmitting} loading={inviteFormik.isSubmitting} onSubmit={() => inviteFormik.handleSubmit()}>
        <div className="space-y-4">
          <FormField label="Email Address" name="inviteEmail" type="email" placeholder="colleague@company.com" value={inviteFormik.values.email} onChange={(v) => inviteFormik.setFieldValue("email", v)} onBlur={inviteFormik.handleBlur} error={inviteFormik.touched.email ? inviteFormik.errors.email : undefined} touched={!!inviteFormik.touched.email} required />
          <FormSelect
            label="Role"
            name="inviteRole"
            value={inviteRole}
            onChange={(v) => setInviteRole(v as TeamRole)}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Developer", value: "developer" },
              { label: "Viewer", value: "viewer" },
            ]}
          />
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
            <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"><Plus className="w-4 h-4" />Create Team</DashboardButton>
          </div>
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="w-12 h-12 text-[#8E8E93] mb-4" />
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No teams yet</h3>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6">Create a team to collaborate with others.</p>
              <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"><Plus className="w-4 h-4" />Create Team</DashboardButton>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard key={team._id} team={team} onSelect={() => { dispatch(setSelectedTeam(team)); setDetailTab("overview"); settingsFormik.resetForm(); }} onDelete={() => { setDeleteTeamId(team._id); setShowDeleteTeamModal(true); }} />
            ))}
          </div>
          )}
        </>
      )}

      <Modal open={showCreateModal} size="xl" onClose={() => { setShowCreateModal(false); createFormik.resetForm(); setCreatePlan("starter"); setCreateMembers([]); setCreateMemberEmail(""); setCreateMemberRole("developer"); setCreateMemberError(""); }} title="Create Team" description="Set up a new team and invite members to collaborate on secrets." submitLabel="Create Team" submitDisabled={createFormik.isSubmitting} loading={createFormik.isSubmitting} onSubmit={() => createFormik.handleSubmit()}>
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Team Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Team Name</label>
                  <FormInput value={createFormik.values.name} onChange={(v) => createFormik.setFieldValue("name", v)} onBlur={createFormik.handleBlur} placeholder="e.g. Acme Corp" error={createFormik.touched.name ? createFormik.errors.name : undefined} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Slug</label>
                  <FormInput value={createFormik.values.slug} onChange={(v) => createFormik.setFieldValue("slug", v)} onBlur={createFormik.handleBlur} placeholder="e.g. acme-corp" error={createFormik.touched.slug ? createFormik.errors.slug : undefined} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Billing Email</label>
                  <FormInput value={createFormik.values.billingEmail} onChange={(v) => createFormik.setFieldValue("billingEmail", v)} onBlur={createFormik.handleBlur} placeholder="billing@company.com" error={createFormik.touched.billingEmail ? createFormik.errors.billingEmail : undefined} />
                </div>
                <FormSelect
                  label="Plan"
                  name="createPlan"
                  value={createPlan}
                  onChange={(v) => setCreatePlan(v as TeamPlan)}
                  options={[
                    { label: "Starter", value: "starter" },
                    { label: "Team", value: "team" },
                    { label: "Enterprise", value: "enterprise" },
                  ]}
                />
              </div>
              <div className="mt-4">
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Allowed Domains</label>
                <FormInput value={createFormik.values.allowedDomains} onChange={(v) => createFormik.setFieldValue("allowedDomains", v)} onBlur={createFormik.handleBlur} placeholder="acme.com, example.com" />
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1.5">Comma-separated list of email domains allowed to join this team.</p>
              </div>
            </div>

            <div className="border-t border-black/[0.04] dark:border-[#222] pt-5">
              <h4 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Invite Members</h4>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Email Address</label>
                  <FormInput
                    value={createMemberEmail}
                    onChange={(v) => { setCreateMemberEmail(v); setCreateMemberError(""); }}
                    placeholder="colleague@company.com"
                    error={createMemberError}
                  />
                </div>
                <FormSelect
                  label="Role"
                  name="createMemberRole"
                  value={createMemberRole}
                  onChange={(v) => setCreateMemberRole(v as TeamRole)}
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Developer", value: "developer" },
                    { label: "Viewer", value: "viewer" },
                  ]}
                  className="w-36"
                />
                <DashboardButton
                  type="button"
                  onClick={() => {
                    const trimmed = createMemberEmail.trim();
                    if (!trimmed) { setCreateMemberError("Email is required"); return; }
                    const parsed = emailSchema.safeParse(trimmed);
                    if (!parsed.success) { setCreateMemberError("Invalid email address"); return; }
                    if (createMembers.some((m) => m.email === parsed.data)) { setCreateMemberError("Member already added"); return; }
                    setCreateMembers((prev) => [...prev, { email: parsed.data, role: createMemberRole }]);
                    setCreateMemberEmail("");
                    setCreateMemberRole("developer");
                    setCreateMemberError("");
                  }}
                  className="h-10 px-4 text-sm font-medium text-white bg-[#007AFF] rounded-[10px] hover:bg-[#007AFF]/90 flex-shrink-0 mt-[22px]"
                >
                  <Plus className="w-4 h-4" />Add
                </DashboardButton>
              </div>

              {createMembers.length > 0 && (
                <div className="mt-4 space-y-1">
                  {createMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <Mail className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={m.role} />
                        <DashboardButton
                          type="button"
                          onClick={() => setCreateMembers((prev) => prev.filter((_, idx) => idx !== i))}
                          className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </DashboardButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>

      <AlertModal
        open={showDeleteTeamModal}
        onClose={() => setShowDeleteTeamModal(false)}
        variant="warning"
        title="Delete Team"
        message="All team data will be permanently deleted, including projects, secrets, and member associations. This cannot be undone."
        buttons={[
          { label: "Cancel", onClick: () => setShowDeleteTeamModal(false), variant: "secondary" },
          { label: "Delete Team", onClick: handleDeleteTeamConfirm, variant: "destructive" },
        ]}
      />

      <AlertModal
        open={confirmMemberRemove !== null}
        onClose={() => setConfirmMemberRemove(null)}
        variant="warning"
        title="Remove Member"
        message="Are you sure you want to remove this member from the team? They will lose access to all team resources."
        buttons={[
          { label: "Cancel", onClick: () => setConfirmMemberRemove(null), variant: "secondary" },
          { label: "Remove", onClick: confirmRemoveMember, variant: "destructive" },
        ]}
      />

      <AlertModal
        open={confirmInviteRevoke !== null}
        onClose={() => setConfirmInviteRevoke(null)}
        variant="warning"
        title="Revoke Invite"
        message="Are you sure you want to revoke this invitation? The invited person will no longer be able to join."
        buttons={[
          { label: "Cancel", onClick: () => setConfirmInviteRevoke(null), variant: "secondary" },
          { label: "Revoke", onClick: confirmRevokeInvite, variant: "destructive" },
        ]}
      />
    </div>
  );
}
