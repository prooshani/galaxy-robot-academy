export interface MissionNavigationItem {
  missionId: string;
  sessionNumber: number;
}

export function getNextAvailableMission(
  orderedCanonicalMissions: MissionNavigationItem[],
  availableMissions: MissionNavigationItem[],
  missionId: string
): MissionNavigationItem | undefined {
  const availableMissionIds = new Set(availableMissions.map((mission) => mission.missionId));
  const availableCanonicalMissions = orderedCanonicalMissions.filter((mission) => availableMissionIds.has(mission.missionId));
  const currentMissionIndex = availableCanonicalMissions.findIndex((mission) => mission.missionId === missionId);

  return currentMissionIndex === -1 ? undefined : availableCanonicalMissions[currentMissionIndex + 1];
}

export function getSubmissionError(codeSnippet: string): string | undefined {
  return codeSnippet.trim() ? undefined : "Add your code before sending your transmission.";
}
