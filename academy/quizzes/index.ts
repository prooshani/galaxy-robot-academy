/**
 * Barrel export — canonical quizzes in session order.
 *
 * This file is NOT part of the pnpm workspace — plain object literals only.
 * Sessions 05–12 quizzes will be added when their material is approved.
 */

import { quiz1 } from "./quiz-01";
import { quiz2 } from "./quiz-02";
import { quiz3 } from "./quiz-03";
import { quiz4 } from "./quiz-04";

export const academyQuizzes = [quiz1, quiz2, quiz3, quiz4];
