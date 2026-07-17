/**
 * Registry of the cadet-suit GLBs (authored in Meshy.ai, stored in
 * `apps/web/public/models/suits/`). This is the full, closed set the Suit Forge
 * offers — there is no procedural "custom" option. Each entry becomes a
 * selectable character. `rotationY` corrects facing if a model doesn't face +Z;
 * `scale` is an optional nudge on top of the loader's auto-fit.
 */
export interface SuitAsset {
  id: string;
  name: string;
  file: string; // public path, e.g. "/models/suits/blue-cadet.glb"
  premium?: boolean; // gate behind a paid tier (monetization hook)
  rotationY?: number; // radians, if the model faces away from camera
  scale?: number; // manual multiplier on top of auto-fit (default 1)
}

export const SUIT_ASSETS: SuitAsset[] = [
  { id: "blue-cadet", name: "Blue Cadet", file: "/models/suits/blue-cadet.glb" },
  { id: "eva-recon", name: "EVA Recon", file: "/models/suits/eva-recon.glb" },
  { id: "american-cadet", name: "American Cadet", file: "/models/suits/american-cadet.glb" },
  { id: "nasa-cad", name: "NASA Cadet", file: "/models/suits/nasa-cad.glb" },
  { id: "spacewalker", name: "Spacewalker", file: "/models/suits/spacewalker.glb" },
  { id: "space-jumper", name: "Space Jumper", file: "/models/suits/space-jumper.glb" },
  { id: "blue-hornet", name: "Blue Hornet", file: "/models/suits/blue-hornet.glb" },
  { id: "lava-hornet", name: "Lava Hornet", file: "/models/suits/lava-hornet.glb" },
  { id: "black-fox", name: "Black Fox", file: "/models/suits/black-fox.glb" },
  { id: "carot-cadet", name: "Carrot Cadet", file: "/models/suits/carot-cadet.glb" },
  { id: "sam-smol", name: "Sam Smol", file: "/models/suits/sam-smol.glb" },
  { id: "buzz-lightyear", name: "Buzz Lightyear", file: "/models/suits/buzz-lightyear.glb", premium: true },
  { id: "among-us", name: "Among Us", file: "/models/suits/among-us.glb" },
  { id: "among-crewmate", name: "Crewmate", file: "/models/suits/among-crewmate.glb" },
  { id: "space-bunny", name: "Space Bunny", file: "/models/suits/space_bunny.glb" },
  { id: "r2d2", name: "R2-D2", file: "/models/suits/r2d2.glb" },
];

/** The suit every new cadet starts in. */
export const DEFAULT_SUIT_ID = "blue-cadet";

export function getSuitAsset(id?: string | null): SuitAsset | undefined {
  return SUIT_ASSETS.find((a) => a.id === id);
}

/** Always resolve to a real asset — falls back to the default, never null. */
export function resolveSuitAsset(id?: string | null): SuitAsset {
  return getSuitAsset(id) ?? getSuitAsset(DEFAULT_SUIT_ID) ?? SUIT_ASSETS[0];
}
