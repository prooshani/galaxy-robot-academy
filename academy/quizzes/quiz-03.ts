/**
 * Quiz 03 — Communication Channel Check
 *
 * Canonical quiz for Session 3 (Open the Communication Channel).
 * Source: materials/session-03/QUICK_QUIZ.md (approved).
 * 7 questions · passing 5/7 · 10 GE awarded once.
 */

export const quiz3 = {
  quizId: "quiz-03",
  missionId: "mission-03",
  title: "Communication Channel Check",
  passingScore: 5,
  rewardGE: 10,
  questions: [
    {
      questionId: "quiz-03-q1",
      type: "multiple-choice",
      prompt: "What does input() do?",
      options: [
        { id: "a", label: "Asks the user a question and waits for their answer" },
        { id: "b", label: "Prints a message twice" },
        { id: "c", label: "Turns the computer off" },
        { id: "d", label: "Deletes a variable" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "input() opens the communication channel: it shows a question, waits, and hands the typed answer to your program.",
    },
    {
      questionId: "quiz-03-q2",
      type: "multiple-choice",
      prompt: "What type of value does input() give back, even if you type 25?",
      options: [
        { id: "a", label: "A number (integer)" },
        { id: "b", label: "Text (a string)" },
        { id: "c", label: "A list" },
        { id: "d", label: "Nothing" },
      ],
      correctOptionIds: ["b"],
      explanation:
        'input() always returns text. Typing 25 gives you "25" — text that looks like a number.',
    },
    {
      questionId: "quiz-03-q3",
      type: "multiple-choice",
      prompt: "Why do we wrap input() in int()?",
      code: 'age = int(input("Age: "))',
      options: [
        { id: "a", label: "To convert the text answer into a real number for maths" },
        { id: "b", label: "To make the answer shorter" },
        { id: "c", label: "To ask the question twice" },
        { id: "d", label: "int() checks the spelling" },
      ],
      correctOptionIds: ["a"],
      explanation:
        'int() converts text like "25" into the number 25, so calculations like age + 1 work.',
    },
    {
      questionId: "quiz-03-q4",
      type: "multiple-choice",
      prompt: "What does the f do in this line?",
      code: 'print(f"Hello {name}")',
      options: [
        { id: "a", label: "It makes the message print faster" },
        { id: "b", label: "It lets Python put the value of name inside the message" },
        { id: "c", label: "It means the message is final" },
        { id: "d", label: "It is a spelling mistake" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "An f-string fills in the blanks: Python replaces {name} with the value stored in the name variable.",
    },
    {
      questionId: "quiz-03-q5",
      type: "multiple-choice",
      prompt: "This program should show the age next year, but it fails. What is the fix?",
      code: 'age = input("Age: ")\nprint(age + 1)',
      options: [
        { id: "a", label: 'Convert the answer: age = int(input("Age: "))' },
        { id: "b", label: "Ask the question louder" },
        { id: "c", label: "Change + 1 to + \"1\"" },
        { id: "d", label: "Remove the print line" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "input() gives text, and text + 1 fails. Convert with int() first, then age + 1 works.",
    },
    {
      questionId: "quiz-03-q6",
      type: "multiple-choice",
      prompt: "Which answer is asked for but never stored?",
      code: 'name = input("Name: ")\ninput("Favorite food: ")\nprint(f"Hello {name}")',
      options: [
        { id: "a", label: "The name" },
        { id: "b", label: "The favorite food" },
        { id: "c", label: "Both are stored" },
        { id: "d", label: "Neither is stored" },
      ],
      correctOptionIds: ["b"],
      explanation:
        "The food answer has no variable = in front, so it disappears. R0-B0 hears it but cannot remember it.",
    },
    {
      questionId: "quiz-03-q7",
      type: "multiple-choice",
      prompt: "How does input() make a program interactive?",
      options: [
        { id: "a", label: "The program can change what it does based on the user's answers" },
        { id: "b", label: "It adds colors to the screen" },
        { id: "c", label: "It makes the program run faster" },
        { id: "d", label: "It stops all errors" },
      ],
      correctOptionIds: ["a"],
      explanation:
        "Interactive means the program listens and responds — every user can get a different result from their own answers.",
    },
  ],
};
