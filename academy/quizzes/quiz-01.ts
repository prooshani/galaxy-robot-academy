/**
 * Quiz 01 — Speech Module Check
 *
 * Canonical quiz for Session 1 (Wake Up R0-B0).
 * Source: materials/session-01/QUICK_QUIZ.md (approved).
 * 7 questions · passing 5/7 · 10 GE awarded once.
 */

export const quiz1 = {
  quizId: "quiz-01",
  missionId: "mission-01",
  title: "Speech Module Check",
  passingScore: 5,
  rewardGE: 10,
  questions: [
    {
      questionId: "quiz-01-q1",
      type: "multiple-choice",
      prompt: "What does print() do?",
      options: [
        { id: "a", label: "Shows a message on the screen" },
        { id: "b", label: "Prints your code on paper" },
        { id: "c", label: "Saves your program to a file" },
        { id: "d", label: "Deletes a message" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "print() is R0-B0's speech module: it shows a message on the screen so humans can read it.",
    },
    {
      questionId: "quiz-01-q2",
      type: "multiple-choice",
      prompt: "Why does text need quotation marks?",
      options: [
        { id: "a", label: "To make the text look pretty" },
        { id: "b", label: "So Python knows it is a message, not an instruction" },
        { id: "c", label: "Quotation marks make the text louder" },
        { id: "d", label: "Text does not need quotation marks" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "Quotation marks tell Python: this part is a message to say, not a command to run.",
    },
    {
      questionId: "quiz-01-q3",
      type: "multiple-choice",
      prompt: "Which line of this program runs first?",
      code: 'print("Systems check")\nprint("Engines ready")\nprint("Lift off!")',
      options: [
        { id: "a", label: 'print("Lift off!")' },
        { id: "b", label: 'print("Engines ready")' },
        { id: "c", label: 'print("Systems check")' },
        { id: "d", label: "All three run at the same time" },
      ],
      correctOptionIds: ["c"],
      explanation:
        "Python reads code like a checklist: top to bottom, one line at a time. The first line runs first.",
    },
    {
      questionId: "quiz-01-q4",
      type: "multiple-choice",
      prompt: "This line shows an error. What is the fix?",
      code: 'Print("Hello")',
      options: [
        { id: "a", label: 'Write print with a lowercase p: print("Hello")' },
        { id: "b", label: "Remove the quotation marks" },
        { id: "c", label: "Add a second pair of parentheses" },
        { id: "d", label: "Write HELLO in capital letters" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Python is case-sensitive. The command is print with a lowercase p — Print with a capital P is unknown.",
    },
    {
      questionId: "quiz-01-q5",
      type: "multiple-choice",
      prompt: "Can a program run without errors and still have a problem?",
      options: [
        { id: "a", label: "No — if it runs, it is always correct" },
        { id: "b", label: "Yes — it can run but say the wrong thing or use the wrong order" },
        { id: "c", label: "Only if the computer is broken" },
        { id: "d", label: "Programs never have problems" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "A program can run perfectly and still have a logic problem — like a countdown in the wrong order.",
    },
    {
      questionId: "quiz-01-q6",
      type: "multiple-choice",
      prompt: "What does this program show?",
      code: 'print("A")\nprint("B")\nprint("A")',
      options: [
        { id: "a", label: "A B A — each on its own line" },
        { id: "b", label: "A B — Python skips repeated lines" },
        { id: "c", label: "A A B — Python sorts the letters" },
        { id: "d", label: "B A A — the middle line runs first" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Each print() runs in order and shows its own line: A, then B, then A again. Python never skips or sorts lines.",
    },
    {
      questionId: "quiz-01-q7",
      type: "select-all",
      prompt: "Your program shows an error. Which are good debugging steps? Select all that apply.",
      options: [
        { id: "a", label: "Read the error message" },
        { id: "b", label: "Check the quotation marks and parentheses" },
        { id: "c", label: "Delete the whole program and give up" },
        { id: "d", label: "Check spelling, like print with a lowercase p" },
      ],
      correctOptionIds: ["a", "b", "d"],
      explanation:
        "Engineers read the error, then check quotes, parentheses, and spelling. Deleting everything is not debugging!",
    },
  ],
};
