import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
  Trash2,
  FolderKanban,
  Save,
  ToggleLeft,
  ToggleRight,
  Info,
  Search,
  ChevronRight,
} from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import FormInput from "../../components/dashboard/FormInput";
import FormField from "../../components/dashboard/FormField";
import FormSelect from "../../components/dashboard/FormSelect";
import FilterTabs from "../../components/dashboard/FilterTabs";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import {
  useGetTeamsQuery,
  useCheckEmailsMutation,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useGetTeamInvitesQuery,
  useRevokeInviteMutation,
  useGetProjectsQuery,
} from "../../store";
import { useTeamRole } from "../../hooks/useTeamRole";
import type { Team, TeamMember, TeamInvite, Project } from "../../types";

type TeamRole = "owner" | "admin" | "developer" | "viewer";

type DetailTab = "overview" | "settings" | "projects";

const roleStyles: Record<TeamRole, string> = {
  owner: "bg-[#FF9F0A]/10 text-[#FF9F0A]",
  admin: "bg-[#3B82F6]/10 text-[#3B82F6]",
  developer: "bg-[#22C55E]/10 text-[#22C55E]",
  viewer: "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40",
};


function RoleBadge({ role }: { role: TeamRole }) {
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${roleStyles[role]}`}>{role}</span>
  );
}


const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

function TeamCard({ team, onSelect }: { team: Team; onSelect: () => void }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onSelect}
      className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5 cursor-pointer transition-all duration-200 hover:border-white/[0.10] hover:shadow-xl group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">{team.name}</h3>
            <p className="text-[11px] text-gray-500 dark:text-white/40">{team.slug}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/40">
          <Users className="w-3.5 h-3.5" />{team.memberCount || 0} {(team.memberCount || 0) === 1 ? "member" : "members"}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/40">
          <FolderKanban className="w-3.5 h-3.5" />{(team.projects ?? []).length} projects
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/[0.06]">
        <span className="text-[11px] text-gray-400 dark:text-white/30">{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : ""}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100, "Name must be at most 100 characters"),
  slug: z.string().trim().min(1, "Slug is required").max(100, "Slug must be at most 100 characters"),
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
  const { success: showSuccess, error: showError } = useToast();
  const navigate = useNavigate();
  const { data: teams = [], isLoading: teamsLoading } = useGetTeamsQuery();
  const [createTeam] = useCreateTeamMutation();
  const [checkEmails] = useCheckEmailsMutation();
  const [updateTeam] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const [inviteMember] = useInviteMemberMutation();
  const [removeMember] = useRemoveMemberMutation();
  const [revokeInvite] = useRevokeInviteMutation();

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);

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
  const [isCheckingEmails, setIsCheckingEmails] = useState(false);
  const [showUnregisteredConfirm, setShowUnregisteredConfirm] = useState(false);
  const [unregisteredList, setUnregisteredList] = useState<{ email: string; role: TeamRole }[]>([]);
  const [showInviteUnregisteredConfirm, setShowInviteUnregisteredConfirm] = useState(false);
  const [pendingInviteEmail, setPendingInviteEmail] = useState("");

  const params = useParams<{ teamId: string }>();
  const location = useLocation();
  const urlTeamId = params.teamId;
  const isSettingsPath = location.pathname.endsWith("/settings");
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    if (urlTeamId && !teamsLoading) {
      const found = teams.find((t) => t._id === urlTeamId);
      if (found) {
        setUrlError(false);
        setSelectedTeam(found);
        if (isSettingsPath) {
          setDetailTab("settings");
        } else {
          setDetailTab("overview");
        }
      } else {
        setUrlError(true);
      }
    }
  }, [urlTeamId, teams, isSettingsPath, teamsLoading]);

  useEffect(() => {
    if (location.state?.openNewTeam) {
      setShowCreateModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const teamId = selectedTeam?._id || "";
  const { data: teamMembers = [], isLoading: membersLoading } = useGetTeamMembersQuery(teamId, { skip: !teamId });
  const { data: teamInvites = [] } = useGetTeamInvitesQuery(teamId, { skip: !teamId });
  const { data: allProjects = [] } = useGetProjectsQuery();
  const teamProjects = allProjects.filter((p: Project) => p.teamId === teamId);
  const { canDelete, canEdit, canManageMembers } = useTeamRole(teamId);

  const pendingInvites = teamInvites.filter((inv) => !teamMembers.some((m) => m.email === inv.email));

  const executeCreateTeam = async (values: typeof createFormik.initialValues, resetForm: () => void) => {
    try {
      const members = createMembers.length > 0 ? createMembers.map((m) => ({ email: m.email, role: m.role })) : undefined;
      await createTeam({ name: values.name, slug: values.slug, emails: members }).unwrap();
      showSuccess("Team created", `${values.name} has been created.`);
      setShowCreateModal(false);
      resetForm();
      setCreateMembers([]);
      setCreateMemberEmail("");
      setCreateMemberRole("developer");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to create team");
    }
  };

  const createFormik = useFormik({
    initialValues: { name: "", slug: "", allowedDomains: "" },
    validate: validateZod(createTeamSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (createMembers.length > 0) {
        setIsCheckingEmails(true);
        try {
          const result = await checkEmails({ emails: createMembers.map((m) => m.email) }).unwrap();
          const unregistered = createMembers.filter((m) => result.unregistered.includes(m.email));
          if (unregistered.length > 0) {
            setUnregisteredList(unregistered);
            setShowUnregisteredConfirm(true);
          } else {
            await executeCreateTeam(values, resetForm);
          }
        } catch {
          setUnregisteredList(createMembers);
          setShowUnregisteredConfirm(true);
        } finally {
          setIsCheckingEmails(false);
          setSubmitting(false);
        }
        return;
      }

      await executeCreateTeam(values, resetForm);
      setSubmitting(false);
    },
  });

  const inviteFormik = useFormik({
    initialValues: { email: "" },
    validate: validateZod(inviteMemberSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedTeam) return;
      try {
        await inviteMember({ teamId: selectedTeam._id, email: values.email, role: inviteRole }).unwrap();
        setShowInviteModal(false);
        resetForm();
        setInviteRole("developer");
        showSuccess("Invite sent", `An invitation has been sent to ${values.email}.`);
      } catch (err: any) {
        showError(err?.data?.msg || "Failed to send invite");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const settingsFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: selectedTeam?.name ?? "",
      slug: selectedTeam?.slug ?? "",
    },
    validate: validateZod(updateTeamSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedTeam) return;
      try {
        await updateTeam({ id: selectedTeam._id, name: values.name, slug: values.slug }).unwrap();
        showSuccess("Settings saved", "Team settings have been updated successfully.");
      } catch (err: any) {
        showError(err?.data?.msg || "Failed to update team");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function openSettingsForm() {
    if (!selectedTeam) return;
    if (!canEdit) return;
    setEnforce2fa(selectedTeam.enforce2fa);
    setDetailTab("settings");
  }

  async function handleDeleteTeamConfirm() {
    if (!deleteTeamId) return;
    try {
      await deleteTeam(deleteTeamId).unwrap();
      setSelectedTeam(null);
      setDeleteTeamId(null);
      setShowDeleteTeamModal(false);
      setDetailTab("overview");
      showSuccess("Team deleted", "The team has been removed.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to delete team");
    }
  }

  async function confirmRemoveMember() {
    if (!selectedTeam || !confirmMemberRemove) return;
    try {
      await removeMember({ teamId: selectedTeam._id, memberId: confirmMemberRemove }).unwrap();
      setConfirmMemberRemove(null);
      showSuccess("Member removed", "Team member has been removed successfully.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to remove member");
    }
  }

  async function confirmRevokeInvite() {
    if (!selectedTeam || !confirmInviteRevoke) return;
    try {
      await revokeInvite({ teamId: selectedTeam._id, inviteId: confirmInviteRevoke }).unwrap();
      setConfirmInviteRevoke(null);
      showSuccess("Invite revoked", "The invitation has been revoked.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to revoke invite");
    }
  }

  function handleRemoveMember(memberId: string) {
    setConfirmMemberRemove(memberId);
  }

  function handleRevokeInvite(inviteId: string) {
    setConfirmInviteRevoke(inviteId);
  }

  if (teamsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (urlError) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">Team not found</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6">The team you're looking for doesn't exist or you don't have access to it.</p>
          <button type="button" onClick={() => navigate("/dashboard/teams", { replace: true })} className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-colors">
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const teamDetail = selectedTeam ? (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 pb-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={() => { navigate("/dashboard/teams"); setSelectedTeam(null); setDetailTab("overview"); }} className="cursor-pointer p-2 rounded-xl text-gray-500 dark:text-white/40 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">{selectedTeam.name}</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{selectedTeam.slug}</p>
        </div>
        {canDelete && (
          <button type="button" onClick={() => { setDeleteTeamId(selectedTeam._id); setShowDeleteTeamModal(true); }} className="cursor-pointer h-9 px-4 text-sm font-medium text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all duration-200 inline-flex items-center gap-2">
            <Trash2 className="w-4 h-4" />Delete Team
          </button>
        )}
      </div>

      <FilterTabs options={detailTabs.map((t) => t.label)} value={detailTabs.find((t) => t.value === detailTab)?.label || "Overview"} onChange={(v) => setDetailTab(detailTabs.find((t) => t.label === v)?.value || "overview")} />

      <div className="mt-6">
        {detailTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            <div className="xl:col-span-2 space-y-6">
              <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                <div className="flex items-center justify-between mb-4">
                  <SectionHeader title="Team Information" description="Manage your team settings and preferences." />
                  <button type="button" onClick={openSettingsForm} disabled={!canEdit} className="h-8 px-3 text-xs font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5">
                    <Settings className="w-3 h-3" />Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Name</p><p className="text-sm text-gray-900 dark:text-[#FAFAFA]">{selectedTeam.name}</p></div>
                  <div><p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Slug</p><p className="text-sm text-gray-900 dark:text-[#FAFAFA]">{selectedTeam.slug}</p></div>
                  <div><p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Enforce 2FA</p><p className="text-sm text-gray-900 dark:text-[#FAFAFA]">{selectedTeam.enforce2fa ? "Enabled" : "Disabled"}</p></div>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-200 dark:border-white/[0.06]">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-2">Allowed Domains</p>
                  {(selectedTeam.allowedDomains ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">{(selectedTeam.allowedDomains ?? []).map((d: string) => (<span key={d} className="text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-md">{d}</span>))}</div>
                  ) : <p className="text-sm text-gray-400 dark:text-white/30">No domains restricted</p>}
                </div>
              </motion.div>

              {membersLoading ? (
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8 flex items-center justify-center"><LoadingSpinner size={24} /></motion.div>
              ) : (
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-5">
                    <SectionHeader title="Members" description={`${teamMembers.length} members in this team.`} />
                    {canManageMembers && (
                      <button type="button" onClick={() => setShowInviteModal(true)} className="cursor-pointer h-8 px-3 text-xs font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-1.5">
                        <UserPlus className="w-3 h-3" />Invite
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {teamMembers.map((m: TeamMember) => {
                      const memberName = typeof m.userId === "object" && m.userId ? (m.userId as any).name || "" : m.name || "";
                      const memberEmail = typeof m.userId === "object" && m.userId ? (m.userId as any).email || "" : m.email || "";
                      return (
                        <div key={m._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-200">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-white/40 flex-shrink-0">{memberName?.charAt(0) || "?"}</div>
                            <div className="min-w-0"><p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{memberName}</p><p className="text-[11px] text-gray-500 dark:text-white/40">{memberEmail}</p></div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <RoleBadge role={m.role} />
                            <span className="text-[11px] text-gray-400 dark:text-white/30 hidden sm:inline">{m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : ""}</span>
                            {canManageMembers && m.role !== "owner" && <button type="button" onClick={() => handleRemoveMember(m._id)} className="cursor-pointer p-1.5 rounded-lg text-gray-500 dark:text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"><X className="w-3.5 h-3.5" /></button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {pendingInvites.length > 0 && (
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                  <SectionHeader title="Pending Invites" description={`${pendingInvites.length} pending invitation${pendingInvites.length > 1 ? "s" : ""}.`} />
                  <div className="space-y-1">
                    {pendingInvites.map((inv: TeamInvite) => (
                      <div key={inv._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-200">
                        <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-500 dark:text-white/40" /><div><p className="text-sm text-gray-900 dark:text-[#FAFAFA]">{inv.email}</p><p className="text-[11px] text-gray-500 dark:text-white/40">Expires {new Date(inv.expiresAt).toLocaleDateString()}</p></div></div>
                        <div className="flex items-center gap-2"><RoleBadge role={inv.role} />{canManageMembers && <button type="button" onClick={() => handleRevokeInvite(inv._id)} className="cursor-pointer text-[11px] text-accent hover:text-accent/80 font-medium">Revoke</button>}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                <SectionHeader title="Quick Actions" />
                <div className="space-y-2">
                  <button type="button" onClick={openSettingsForm} disabled={!canEdit} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start disabled:opacity-40 disabled:cursor-not-allowed"><Settings className="w-4 h-4" />Team Settings</button>
                  {canManageMembers && (
                    <button type="button" className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start"><UserPlus className="w-4 h-4" />Copy Invite Link</button>
                  )}
                  <button type="button" onClick={() => setDetailTab("projects")} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start"><FolderKanban className="w-4 h-4" />View Projects</button>
                </div>
              </motion.div>
              {canDelete && (
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-red-500/20 p-5">
                  <SectionHeader title="Danger Zone" />
                  <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl mb-4"><AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /><div><p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Delete Team</p><p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Permanently delete this team and all its data.</p></div></div>
                  <button type="button" onClick={() => { setDeleteTeamId(selectedTeam._id); setShowDeleteTeamModal(true); }} className="cursor-pointer w-full h-9 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-500/90 transition-all duration-200 inline-flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />Delete Team</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {detailTab === "settings" && (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <SectionHeader title="Team Settings" description="Modify your team details and preferences." />
              <form onSubmit={settingsFormik.handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField label="Team Name" name="name" placeholder={settingsFormik.values.name || "e.g. Acme Corp"} value={settingsFormik.values.name} onChange={(v) => settingsFormik.setFieldValue("name", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined} touched={!!settingsFormik.touched.name} required disabled={!canEdit} />
                  <FormField label="Slug" name="slug" placeholder={settingsFormik.values.slug || "e.g. acme-corp"} value={settingsFormik.values.slug} onChange={(v) => settingsFormik.setFieldValue("slug", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.slug ? settingsFormik.errors.slug : undefined} touched={!!settingsFormik.touched.slug} required disabled={!canEdit} />
                  <div className="flex items-center justify-between py-3">
                    <div><p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Enforce Two-Factor Authentication</p><p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Require all members to enable 2FA.</p></div>
                    <button type="button" onClick={() => setEnforce2fa(!enforce2fa)} disabled={!canEdit} className="text-gray-500 dark:text-white/40 hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors">{enforce2fa ? <ToggleRight className="w-6 h-6 text-[#22C55E]" /> : <ToggleLeft className="w-6 h-6" />}</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1.5">Allowed Domains</label>
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mb-2">Domains comma separated (e.g. acme.com, example.com)</p>
                    <FormInput value={(selectedTeam.allowedDomains ?? []).join(", ")} onChange={() => {}} placeholder="acme.com, example.com" disabled={!canEdit} />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-white/[0.06]">
                  <button type="submit" disabled={settingsFormik.isSubmitting || !canEdit} className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                    {settingsFormik.isSubmitting ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {detailTab === "projects" && (
          <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <SectionHeader title="Projects" description={`${teamProjects.length} projects assigned to this team.`} />
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 dark:text-white/40" />
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-8 pl-9 pr-3 text-xs bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-white placeholder-gray-400 dark:placeholder-white/30 transition-colors duration-200"
                  />
                </div>
                <button type="button" onClick={() => navigate("/dashboard/projects")} className="cursor-pointer h-8 px-3 text-xs font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 flex-shrink-0 inline-flex items-center gap-1.5">
                  <Plus className="w-3 h-3" />New Project
                </button>
              </div>
            </div>
            <div className="space-y-1">
              {teamProjects.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-white/40 py-4 text-center">No projects assigned to this team.</p>
              ) : (
                teamProjects
                  .filter((p: Project) => p.projectName.toLowerCase().includes(projectSearch.toLowerCase()))
                  .map((p: Project) => (
                    <div key={p._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <FolderKanban className="w-4 h-4 text-gray-500 dark:text-white/40 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{p.projectName}</p>
                          <p className="text-[11px] text-gray-500 dark:text-white/40">{p.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
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
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 pb-8 overflow-y-auto">
      {teamDetail || (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Teams</h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{teams.length} teams &middot; Manage your teams and members</p>
            </div>
            <button type="button" onClick={() => setShowCreateModal(true)} className="cursor-pointer h-10 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2 glow-accent">
              <Plus className="w-4 h-4" />Create Team
            </button>
          </div>
          {teams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
              <Users className="w-12 h-12 text-gray-400 dark:text-white/30 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">No teams yet</h3>
              <p className="text-sm text-gray-500 dark:text-white/40 mb-6">Create a team to collaborate with others.</p>
              <button type="button" onClick={() => setShowCreateModal(true)} className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />Create Team
              </button>
            </div>
          ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {teams.map((team) => (
              <TeamCard key={team._id} team={team} onSelect={() => { navigate(`/dashboard/teams/${team._id}`); }} />
            ))}
          </motion.div>
          )}
        </>
      )}

      <Modal open={showCreateModal} size="xl" onClose={() => { setShowCreateModal(false); createFormik.resetForm(); setCreateMembers([]); setCreateMemberEmail(""); setCreateMemberRole("developer"); setCreateMemberError(""); }} title="Create Team" description="Set up a new team and invite members to collaborate on secrets." submitLabel="Create Team" submitDisabled={createFormik.isSubmitting || isCheckingEmails} loading={createFormik.isSubmitting || isCheckingEmails} onSubmit={() => createFormik.handleSubmit()}>
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">Team Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Team Name</label>
                  <FormInput value={createFormik.values.name} onChange={(v) => createFormik.setFieldValue("name", v)} onBlur={createFormik.handleBlur} placeholder="e.g. Acme Corp" error={createFormik.touched.name ? createFormik.errors.name : undefined} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Slug</label>
                  <FormInput value={createFormik.values.slug} onChange={(v) => createFormik.setFieldValue("slug", v)} onBlur={createFormik.handleBlur} placeholder="e.g. acme-corp" error={createFormik.touched.slug ? createFormik.errors.slug : undefined} />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Allowed Domains</label>
                <FormInput value={createFormik.values.allowedDomains} onChange={(v) => createFormik.setFieldValue("allowedDomains", v)} onBlur={createFormik.handleBlur} placeholder="acme.com, example.com" />
                <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1.5">Comma-separated list of email domains allowed to join this team.</p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-white/[0.06] pt-5">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">Invite Members</h4>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Email Address</label>
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
                  className="w-full sm:w-36"
                />
                <button
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
                  className="cursor-pointer h-10 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 sm:flex-shrink-0 sm:mt-[22px] transition-all duration-200 inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />Add
                </button>
              </div>

              {createMembers.length > 0 && (
                <div className="mt-4 space-y-1">
                  {createMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
                      <div className="flex items-center gap-3 min-w-0">
                        <Mail className="w-4 h-4 text-gray-500 dark:text-white/40 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900 dark:text-[#FAFAFA] truncate">{m.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RoleBadge role={m.role} />
                        <button
                          type="button"
                          onClick={() => setCreateMembers((prev) => prev.filter((_, idx) => idx !== i))}
                          className="cursor-pointer p-1.5 rounded-lg text-gray-500 dark:text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
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
        message="Are you sure you want to remove this member from the team?"
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
        message="Are you sure you want to revoke this invitation?"
        buttons={[
          { label: "Cancel", onClick: () => setConfirmInviteRevoke(null), variant: "secondary" },
          { label: "Revoke", onClick: confirmRevokeInvite, variant: "destructive" },
        ]}
      />

      <AlertModal
        open={showUnregisteredConfirm}
        onClose={() => { setShowUnregisteredConfirm(false); setUnregisteredList([]); }}
        variant="info"
        title="Unregistered Users"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-white/40">These users don't have an account yet. They will receive an email invitation to sign up. Do you want to continue?</p>
            <div className="space-y-1">
              {unregisteredList.map((u, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-sm text-gray-900 dark:text-[#FAFAFA]">{u.email}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${roleStyles[u.role]}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        }
        buttons={[
          { label: "No, go back", onClick: () => { setShowUnregisteredConfirm(false); setUnregisteredList([]); }, variant: "secondary" },
          { label: "Yes, send invite", onClick: () => {
            setShowUnregisteredConfirm(false);
            setUnregisteredList([]);
            executeCreateTeam(createFormik.values, createFormik.resetForm);
          }, variant: "primary" },
        ]}
      />

      <AlertModal
        open={showInviteUnregisteredConfirm}
        onClose={() => { setShowInviteUnregisteredConfirm(false); setPendingInviteEmail(""); }}
        variant="info"
        title="Unregistered User"
        message={
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-white/40">This user doesn't have an account yet. They will receive an email invitation to sign up. Do you want to continue?</p>
            <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/[0.04]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-gray-900 dark:text-[#FAFAFA]">{pendingInviteEmail}</span>
              </div>
            </div>
          </div>
        }
        buttons={[
          { label: "Cancel", onClick: () => { setShowInviteUnregisteredConfirm(false); setPendingInviteEmail(""); }, variant: "secondary" },
          { label: "Send invite", onClick: async () => {
            if (!selectedTeam) return;
            setShowInviteUnregisteredConfirm(false);
            try {
              await inviteMember({ teamId: selectedTeam._id, email: pendingInviteEmail, role: inviteRole }).unwrap();
              setPendingInviteEmail("");
              setShowInviteModal(false);
              inviteFormik.resetForm();
              setInviteRole("developer");
              showSuccess("Invite sent", `An invitation has been sent to ${pendingInviteEmail}.`);
            } catch (err: any) {
              showError(err?.data?.msg || "Failed to send invite");
            }
          }, variant: "primary" },
        ]}
      />
    </div>
  );
}
