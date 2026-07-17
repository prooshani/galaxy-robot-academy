/**
 * Quiz 04 — Decision Core Check
 *
 * Canonical quiz for Session 4 (Activate the Decision Core).
 * Source: materials/session-04/QUICK_QUIZ.md (approved).
 * 7 questions · passing 5/7 · 10 GE awarded once.
 */

export const quiz4 = {
  quizId: "quiz-04",
  missionId: "mission-04",
  title: "Decision Core Check",
  passingScore: 5,
  rewardGE: 10,
  questions: [
    {
      questionId: "quiz-04-q1",
      type: "multiple-choice",
      prompt: "What does if do?",
      options: [
        { id: "a", label: "Runs some code only when a condition is true" },
        { id: "b", label: "Repeats code forever" },
        { id: "c", label: "Prints a question mark" },
        { id: "d", label: "Stores a value in memory" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "if is R0-B0's decision maker: the indented code runs only when the condition is true.",
    },
    {
      questionId: "quiz-04-q2",
      type: "multiple-choice",
      prompt: "When does else run?",
      options: [
        { id: "a", label: "Always, no matter what" },
        { id: "b", label: "Only when none of the if and elif conditions were true" },
        { id: "c", label: "Before the if" },
        { id: "d", label: "Never" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "else is the backup plan: it runs only when every condition above it turned out false.",
    },
    {
      questionId: "quiz-04-q3",
      type: "multiple-choice",
      prompt: "What is the difference between = and ==?",
      options: [
        { id: "a", label: "= stores a value; == checks if two values are equal" },
        { id: "b", label: "They are exactly the same" },
        { id: "c", label: "== stores a value twice" },
        { id: "d", label: "= is only for numbers" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "One equals sign stores (energy = 80). Two equals signs ask a question: is energy == 80 true or false?",
    },
    {
      questionId: "quiz-04-q4",
      type: "multiple-choice",
      prompt: "Why does indentation (the spaces) matter after if?",
      options: [
        { id: "a", label: "It shows Python which lines belong inside the decision" },
        { id: "b", label: "It makes the code look bigger" },
        { id: "c", label: "It slows the program down" },
        { id: "d", label: "It does not matter" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "The indented lines are the ones the decision controls. Without indentation, Python cannot tell what belongs to the if.",
    },
    {
      questionId: "quiz-04-q5",
      type: "multiple-choice",
      prompt: "R0-B0's energy is 40. What does this program show?",
      code: 'energy = 40\nif energy >= 80:\n    print("Full power")\nelif energy >= 50:\n    print("Ready")\nelse:\n    print("Recharge needed")',
      options: [
        { id: "a", label: "Full power" },
        { id: "b", label: "Ready" },
        { id: "c", label: "Recharge needed" },
        { id: "d", label: "Nothing at all" },
      ],
      correctOptionIds: ["c"],
      explanation:
        "40 is not >= 80 and not >= 50, so both conditions are false and the else branch runs: Recharge needed.",
    },
    {
      questionId: "quiz-04-q6",
      type: "multiple-choice",
      prompt: "Which check should come first so both branches can be reached?",
      code: "if energy >= ???:\n    ...\nelif energy >= ???:\n    ...",
      options: [
        { id: "a", label: "Check >= 80 first, then >= 50" },
        { id: "b", label: "Check >= 50 first, then >= 80" },
        { id: "c", label: "The order makes no difference" },
        { id: "d", label: "Always check the smallest number first" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "If >= 50 comes first, an energy of 90 stops there and the >= 80 branch can never run. Check the bigger rule first.",
    },
    {
      questionId: "quiz-04-q7",
      type: "multiple-choice",
      prompt: "Which line is a well-formed planetary safety rule?",
      options: [
        { id: "a", label: 'if danger >= 4:\n    print("Exploration cancelled")' },
        { id: "b", label: 'if danger = 4:\n    print("Exploration cancelled")' },
        { id: "c", label: 'if danger >= 4\nprint("Exploration cancelled")' },
        { id: "d", label: 'print("Exploration cancelled") if maybe' },
      ],
      correctOptionIds: ["a"],
      explanation:
        "A safety rule needs a comparison (>=), a colon at the end of the if line, and an indented action underneath.",
    },
  ],
};
