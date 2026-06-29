import { TeamMemberModel, TeamModel, ProjectModel, SecretsModel, EnvironmentModel } from "../models";

export const userService = {
  getOverviewStats: async (userId: string) => {
    const memberships = await TeamMemberModel.find({ userId, status: "active" });
    const teamIds = memberships.map((m) => m.teamId);

    const teams = teamIds.length > 0
      ? await TeamModel.find({ _id: { $in: teamIds } })
      : [];

    const projects = teamIds.length > 0
      ? await ProjectModel.find({ teams: { $in: teamIds } }).sort({ createdAt: -1 })
      : [];

    const projectIds = projects.map((p) => p._id);

    const [secretCount, environmentCount] = projectIds.length > 0
      ? await Promise.all([
          SecretsModel.countDocuments({ projectId: { $in: projectIds } }),
          EnvironmentModel.countDocuments({ projectId: { $in: projectIds } }),
        ])
      : [0, 0];

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const [sc, ec] = projectIds.length > 0
          ? await Promise.all([
              SecretsModel.countDocuments({ projectId: project._id }),
              EnvironmentModel.countDocuments({ projectId: project._id }),
            ])
          : [0, 0];
        return {
          _id: project._id,
          projectName: project.projectName,
          secretCount: sc,
          environmentCount: ec,
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

    const recentSecretsWithProject = await Promise.all(
      recentSecrets.map(async (secret) => {
        const project = projects.find((p) => p._id.toString() === secret.projectId.toString());
        return {
          _id: secret._id,
          secName: secret.secName,
          projectId: secret.projectId,
          projectName: project?.projectName || "",
        };
      }),
    );

    return {
      teams: teams.length,
      projects: projects.length,
      secrets: secretCount,
      environments: environmentCount,
      recentProjects,
      recentSecrets: recentSecretsWithProject,
    };
  },
};
