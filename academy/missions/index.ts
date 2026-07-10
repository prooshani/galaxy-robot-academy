/**
 * Academy missions barrel export.
 *
 * Imports all 12 canonical mission definitions and re-exports them
 * individually plus an ordered collection for the web adapter.
 *
 * This file is NOT part of the pnpm workspace — it uses plain object
 * literals only. No @galaxy/types imports.
 */

import { mission1 } from "./01-wake-up-r0-b0";
import { mission2 } from "./02-memory-module";
import { mission3 } from "./03-communication-systems";
import { mission4 } from "./04-decision-core";
import { mission5 } from "./05-repeat-protocol";
import { mission6 } from "./06-navigation-scanner";
import { mission7 } from "./07-cargo-inventory";
import { mission8 } from "./08-reusable-skill-modules";
import { mission9 } from "./09-planetary-exploration";
import { mission10 } from "./10-random-space-events";
import { mission11 } from "./11-launch-preparation";
import { mission12 } from "./12-mission-to-andromeda";

export {
  mission1,
  mission2,
  mission3,
  mission4,
  mission5,
  mission6,
  mission7,
  mission8,
  mission9,
  mission10,
  mission11,
  mission12,
};

/**
 * Ordered collection of all canonical missions, sorted by session number.
 */
export const academyMissions = [
  mission1,
  mission2,
  mission3,
  mission4,
  mission5,
  mission6,
  mission7,
  mission8,
  mission9,
  mission10,
  mission11,
  mission12,
];
