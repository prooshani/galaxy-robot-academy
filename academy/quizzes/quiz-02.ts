/**
 * Quiz 02 — Memory Core Check
 *
 * Canonical quiz for Session 2 (Install the Memory Core).
 * Source: materials/session-02/QUICK_QUIZ.md (approved).
 * 7 questions · passing 5/7 · 10 GE awarded once.
 */

export const quiz2 = {
  quizId: "quiz-02",
  missionId: "mission-02",
  title: "Memory Core Check",
  passingScore: 5,
  rewardGE: 10,
  questions: [
    {
      questionId: "quiz-02-q1",
      type: "multiple-choice",
      prompt: "What is a variable?",
      options: [
        { id: "a", label: "A named memory box that stores a value" },
        { id: "b", label: "A message shown on the screen" },
        { id: "c", label: "An error in the program" },
        { id: "d", label: "A type of robot" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "A variable is a labelled memory box. R0-B0 stores a value inside and finds it later by its name.",
    },
    {
      questionId: "quiz-02-q2",
      type: "multiple-choice",
      prompt: "Which variable name is clearer for storing remaining energy?",
      options: [
        { id: "a", label: "x" },
        { id: "b", label: "energy_left" },
        { id: "c", label: "thing" },
        { id: "d", label: "e" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "energy_left tells you exactly what is inside the box. A name like x forces you to guess.",
    },
    {
      questionId: "quiz-02-q3",
      type: "multiple-choice",
      prompt: "Which value is text (a string)?",
      code: 'energy = 100\ndestination = "Mars"',
      options: [
        { id: "a", label: "100" },
        { id: "b", label: '"Mars"' },
        { id: "c", label: "Both are text" },
        { id: "d", label: "Neither is text" },
      ],
      correctOptionIds: ["b"],
      explanation:
        '"Mars" has quotation marks, so it is text. 100 has none, so it is a number Python can calculate with.',
    },
    {
      questionId: "quiz-02-q4",
      type: "multiple-choice",
      prompt: "What does this program show?",
      code: "energy = 50\nenergy = 80\nprint(energy)",
      options: [
        { id: "a", label: "50" },
        { id: "b", label: "80" },
        { id: "c", label: "130" },
        { id: "d", label: "An error" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "A variable holds one value at a time. Storing 80 replaces the 50, so print shows 80.",
    },
    {
      questionId: "quiz-02-q5",
      type: "multiple-choice",
      prompt: "This line shows an error. What is the fix?",
      code: 'robot name = "R0-B0"',
      options: [
        { id: "a", label: 'Use an underscore: robot_name = "R0-B0"' },
        { id: "b", label: "Remove the quotation marks" },
        { id: "c", label: "Add more spaces" },
        { id: "d", label: "Write the name in capitals" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Variable names cannot contain spaces. Engineers join the words with an underscore: robot_name.",
    },
    {
      questionId: "quiz-02-q6",
      type: "multiple-choice",
      prompt: "Why does this line fail?",
      code: '"100" - 20',
      options: [
        { id: "a", label: '"100" is text, and Python cannot subtract a number from text' },
        { id: "b", label: "20 is too small" },
        { id: "c", label: "Subtraction is not allowed in Python" },
        { id: "d", label: "It works fine and shows 80" },
      ],
      correctOptionIds: ["a"],
      explanation:
        'The quotation marks make "100" text, not a number. Python cannot do maths with text — the type is wrong.',
    },
    {
      questionId: "quiz-02-q7",
      type: "multiple-choice",
      prompt: "R0-B0 has 8 fuel cells and uses 3. Which line calculates what is left?",
      options: [
        { id: "a", label: "fuel_left = 8 - 3" },
        { id: "b", label: 'fuel_left = "8 - 3"' },
        { id: "c", label: "fuel_left = 8 + 3" },
        { id: "d", label: "print(8) - print(3)" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "8 - 3 with no quotation marks is a real calculation: fuel_left stores 5 fuel cells.",
    },
  ],
};
