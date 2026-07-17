# First-Day Rehearsal — Mission 01: Wake Up R0-B0

**Students:** Parshan and Adriyan (confirm Adriyan's preferred spelling; older project copy says "Adryan")
**Length:** 80 minutes
**Mission:** Install R0-B0's Speech Module
**Python:** `print()`, text in quotation marks, top-to-bottom order
**Engineering habit:** precise instructions and calm debugging

## The win condition

By the end, each student has:

- run at least one `print()` instruction;
- created an eight-message R0-B0 introduction;
- repaired and explained one bug;
- explained that Python runs from top to bottom;
- attempted the 7-question quiz;
- left curious about R0-B0's next upgrade: memory.

If those things happen, the first day worked. Do not trade confidence and curiosity for finishing every optional activity.

## Tonight: 15-minute technical rehearsal

- Charge both student devices and the teacher device; pack chargers and an extension cable.
- Confirm Python runs on both student devices.
- Create and run `mission_01.py` on each device with `print("Test transmission")`.
- Sign in once as Parshan and once as Adriyan; confirm each reaches the student cockpit and can open Mission 01.
- Sign in as teacher; confirm Mission 01 is published and the review queue is reachable.
- Keep these files open in tabs: `LIVE_CODING.md`, `DEBUGGING_GAME.md`, `QUICK_QUIZ.md`, and this rehearsal.
- Put one easy object on a table for the Human Robot Game.
- Prepare two small paper cards labeled **Mission Control** and **R0-B0**.
- Keep a paper copy or screenshot of the mission requirements available as an offline fallback.

## Room setup

- Seat the students beside each other but give each a keyboard and file.
- Put the teacher screen where both can predict output before it runs.
- Write only this on the board before they arrive:

```text
GALAXY ROBOT ACADEMY
MISSION 01: WAKE UP R0-B0
Predict -> Run -> Change -> Run again
```

Do not put Python syntax on the board yet. Reveal it as the robot's first instruction.

## Full spoken rehearsal

### 0:00–0:05 — Incoming transmission

Stand at the door and welcome each student as a **Junior Engineer**.

Say:

> Welcome to Galaxy Robot Academy. In the year 2149, Mission Control built an exploration robot named R0-B0. Its hardware is ready, but its software is empty. It cannot speak, remember, or make decisions. Only two junior engineers were selected to bring it to life: Parshan and Adriyan. Your first mission is to install its Speech Module.

Ask each student one question:

- “What should R0-B0 say first?”
- “What is one thing you would teach your own robot?”

Write both answers down. Promise to use them during coding.

Transition:

> Before we write robot instructions, we need to discover how exact an instruction must be.

### 0:05–0:15 — Human Robot Game

Give Parshan the R0-B0 card and Adriyan the Mission Control card. Mission Control must guide R0-B0 to pick up the object using literal, one-step instructions. After two minutes, switch roles.

Play R0-B0 literally but safely. If told “pick it up” without approaching the object, say “Object out of reach.” Do not turn the activity into a trick; the point is improvement.

Ask:

- “Which instruction was unclear?”
- “What happened when one step was missing?”
- “Would the same instructions work in a different order?”

Land the lesson with:

> Computers follow what we write, not what we meant. A software engineer makes instructions clear, checks the result, and improves them.

### 0:15–0:25 — First Python instruction

Type slowly, without explaining everything first:

```python
print("Hello, Galaxy!")
```

Before running it, ask both students to predict what will happen. Then run it.

Explain only four things:

- `print` is the instruction;
- parentheses hold what the instruction needs;
- quotation marks tell Python that this is text;
- Python follows lines from top to bottom.

Let each student change the message and run it. Use their opening ideas from minute five.

Transition:

> One message proves the Speech Module works. Now we must teach R0-B0 a complete startup sequence.

### 0:25–0:40 — Guided startup sequence

Build this together one line at a time:

```python
print("R0-B0 online.")
print("Power core activated.")
print("Navigation system loading...")
print("Communication channel open.")
print("Hello, engineers!")
```

For every addition, use the same loop:

1. Predict the output.
2. Run it.
3. Change one thing.
4. Run it again.

Give Parshan and Adriyan at least two system ideas each. Swap two lines and ask what changed. Add one funny line such as a banana-shield warning, but let the students improve it.

Avoid introducing variables, loops, or input. “That is a future robot upgrade” is enough.

### 0:40–0:58 — Independent mission

Say:

> Mission Control needs R0-B0 to introduce itself to the Galaxy Council. Create eight original messages in a sensible order.

Each program must include:

1. robot name;
2. purpose;
3. home base;
4. destination;
5. useful system or tool;
6. warning;
7. joke or funny line;
8. final launch-ready message.

Teacher behavior:

- First two minutes: stay quiet and let them begin.
- If one student stalls, ask, “What should the next message say?” before touching syntax.
- If one student helps, require explanation rather than keyboard takeover.
- At minute 50, give a calm eight-minute warning.
- At minute 56, ask each student to choose one favorite line to read aloud.

If someone finishes early, offer exactly one bonus: countdown, robot face, alien interruption, or alternate ending. Do not introduce new Python concepts.

### 0:58–1:08 — Debugging Detectives

Tell them bugs are evidence and each correct explanation is an engineering discovery.

Show these one at a time:

```python
print(R0-B0 online.)
```

```python
print("Navigation online."
```

```python
Print("Communication ready.")
```

Then show a program that runs but says “Launch ready” before “R0-B0 online.” Ask why working code can still be wrong.

Use the debugging routine:

1. Read what Python says.
2. Point to the suspicious area.
3. Change one thing.
4. Run again.
5. Explain the repair.

Never grab the keyboard immediately. Ask: “What was opened but not closed?” or “How does Python know this is text?”

### 1:08–1:16 — Quiz and debrief

Open **Speech Module Check**. It has seven questions and passes at 5/7, with retries allowed.

Have them answer independently, but pause after submission to discuss:

- What does `print()` do?
- Why do quotation marks matter?
- Why does order matter?
- What is one good debugging step?

Do not let the score become a competition. A retry is another test run, not a failure.

### 1:16–1:20 — Mission complete

Gather attention and say:

> R0-B0 can speak because you gave it precise instructions, tested them, and repaired its bugs. Speech Module installed. Mission complete.

Award the **First Contact** badge when the mission criteria are met. The current website awards 55 GE for Mission 01 and 10 GE for the quiz; use the site as the source of truth rather than calculating totals aloud.

Brief the homework: eight `print()` messages for the Galaxy Council plus the reflection, “Which line is your favorite, and why?” Expected time is 15–20 minutes.

End on a cliffhanger:

> R0-B0 can speak now—but if we switch it off, it forgets everything. What upgrade does it need next?

Let them discover **the Memory Core**.

## Coaching lines to memorize

- “What do you predict before we run it?”
- “Show me the evidence.”
- “Change one thing, then test again.”
- “How does Python know that is text?”
- “What was opened but not closed?”
- “Your code runs. Does it tell the story in the right order?”
- “Explain it to your teammate without taking the keyboard.”
- “That bug just gave us a clue.”

## Recovery plans

### If the website or sign-in fails

Do not troubleshoot in front of the students for more than two minutes. Open `mission_01.py`, teach the entire class locally, use the paper mission card, and submit the code to the website later. The learning mission does not depend on the website.

### If Python fails on one device

Pair-program with roles that switch every three minutes:

- **Pilot:** types;
- **Mission Control:** predicts, checks punctuation, and explains.

No keyboard takeover outside the role change.

### If attention drops

Run a 60-second “alien transmission”: each student adds one connected message, runs it, and passes control. Then return to the current step.

### If time is short

Keep the opening, one working `print()`, the eight-line mission, one debugging example, and the closing. Move the quiz to the website/homework. Never cut the mission-complete moment.

### If a student is far ahead

Offer creativity, not new syntax: two personalities, alternate ending, robot face, or dialogue. Ask for a clear explanation of order.

### If a student is frustrated

Reduce the task to copy-change-run with four lines, celebrate the first working result, then build toward eight together. Ask questions about one punctuation mark at a time.

## Five-minute post-class capture

Immediately after class, note:

- one thing that energized Parshan;
- one thing that energized Adriyan;
- one concept each could explain without help;
- one recurring bug each encountered;
- whether the 80-minute pacing felt fast, slow, or right;
- one adjustment for Session 02.

Send feedback using the academy standard: one thing that worked, one specific improvement, and one next action.
