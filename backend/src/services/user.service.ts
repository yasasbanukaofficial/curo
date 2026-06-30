import { TeamMemberModel, TeamModel, ProjectModel, SecretsModel, EnvironmentModel } from "../models";

export const userService = {
  getOverviewStats: async (userId: string) => {
    const memberships = await TeamMemberModel.find({ userId, status: "active" });
    const teamIds = memberships.map((m) => m.teamId);

    const teams = teamIds.length > 0
      ? await TeamModel.find({ _id: { $in: teamIds } }).lean()
      : [];
    const teamMap = new Map(teams.map((t) => [t._id.toString(), t.name]));

    const allProjects = await ProjectModel.find({
      $or: [
        { userId, teamId: null },
        { userId, teamId: { $exists: false } },
        { teamId: { $in: teamIds } },
      ],
    })
      .sort({ updatedAt: -1 })
      .lean();

    const projectIds = allProjects.map((p) => p._id);

    const [secretCount, environmentCount] = projectIds.length > 0
      ? await Promise.all([
          SecretsModel.countDocuments({ projectId: { $in: projectIds } }),
          EnvironmentModel.countDocuments({ projectId: { $in: projectIds } }),
        ])
      : [0, 0];

    const projectsWithCounts = await Promise.all(
      allProjects.map(async (project) => {
        const [sc, ec] = projectIds.length > 0
          ? await Promise.all([
              SecretsModel.countDocuments({ projectId: project._id }),
              EnvironmentModel.countDocuments({ projectId: project._id }),
            ])
          : [0, 0];
        const tid = project.teamId?.toString() || null;
        const p = project as any;
        return {
          _id: p._id,
          projectName: p.projectName,
          teamId: tid,
          teamName: tid ? teamMap.get(tid) || null : null,
          secretCount: sc,
          environmentCount: ec,
          updatedAt: p.updatedAt || undefined,
        };
      }),
    );

    const recentProjects = projectsWithCounts.slice(0, 3);

    const recentSecrets = projectIds.length > 0
      ? await SecretsModel.find({ projectId: { $in: projectIds } })
          .sort({ _id: -1 })
          .limit(3)
          .lean()
      : [];

    const recentSecretsWithProject = recentSecrets.map((secret) => {
      const project = allProjects.find((p) => p._id.toString() === secret.projectId.toString());
      const created = parseInt(secret._id.toString().substring(0, 8), 16) * 1000;
      return {
        _id: secret._id,
        secName: secret.secName,
        projectId: secret.projectId,
        projectName: project?.projectName || "",
        createdAt: new Date(created).toISOString(),
      };
    });

    return {
      teams: teams.length,
      projects: allProjects.length,
      secrets: secretCount,
      environments: environmentCount,
      recentProjects,
      recentSecrets: recentSecretsWithProject,
    };
  },
};
