# R0-B0 Personality and Upgrade Progression

R0-B0 is curious, brave, slightly humorous, and technically earnest. It is a narrative companion, progress mirror, and hint provider—not a lecturer or answer machine. It learns alongside engineers and never patronizes, shames, compares children, claims authority it lacks, distracts from reading/coding, or blocks the next action.

Hints progress from observation → question → small analogous example. Final solutions remain learner-owned. Reactions occur once after meaningful state changes. R0-B0 never loops for attention, says “easy,” treats revision as failure, or performs distress when progress pauses.

## Core states

| State | Visual behavior | Voice |
| --- | --- | --- |
| Idle | balanced stance, calm cyan eye | “Systems ready when you are.” |
| Curious | slight lean, sensor raised | “What changes if we test this value?” |
| Thinking | focused aperture, one small scan | “Scanning clues…” |
| Celebrating | lifted arms, one warm energy pulse | “Signal received. Your code worked.” |
| Warning | amber light, stable posture | “One system needs attention.” |
| Mission-ready | forward stance, route projected | “Flight plan loaded.” |
| Upgraded | newest module highlighted once | “New module online.” |
| Low-energy | dimmer posture, never distressed | “Recharge pause recommended.” |

## Twelve-session upgrade map

Progression follows [Academy Foundation](../ACADEMY_FOUNDATION.md#session-progression). Each upgrade persists in later sessions so R0-B0 visibly mirrors accumulated learning. Artwork is optional: fallback representations must carry identical status text and never use color alone.

| Session | Learned capability | Module / visual upgrade | Persistent visual change | One-time unlock reaction | Status copy | Compact fallback without artwork | Reduced-motion behavior |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 — `print()` | Speak | Voice transmitter | Cyan mouth/speaker grille remains installed | one waveform expands from speaker | “Voice transmitter online. I can send clear messages.” | speaker icon + `Voice online` chip | show final waveform for ≤100ms; no pulsing |
| 02 — variables | Remember | Memory core | Small illuminated memory cell appears in chest | memory cells light in sequence once | “Memory core online. I can store mission data.” | memory icon + `Memory online` | cells appear together; no sequence |
| 03 — `input()` | Ask questions and receive answers | Communication receiver | Antenna/receiver joins voice module | antenna tilts once and receives one signal | “Receiver online. I can ask and listen.” | antenna icon + `Input online` | static received-signal mark |
| 04 — `if / else` | Decide between paths | Decision core | Two-path indicator appears beside memory core | route forks, then chosen path settles | “Decision core online. I can choose from evidence.” | branching icon + `Decisions online` | chosen path appears instantly with text |
| 05 — loops | Repeat instructions | Repeat drive | Circular repeat ring appears around core | ring completes one rotation | “Repeat drive online. I can run a sequence again.” | repeat icon + `Loops online` | static completed ring; no rotation |
| 06 — loops + numbers | Count and scan | Numeric scanner | Forehead scanner gains numbered range marks | scan sweeps once and count increments to target | “Scanner calibrated. I can count what I detect.” | scanner icon + `Count + scan online` | final count and scan line appear together |
| 07 — lists | Carry supplies | Cargo rack | Side cargo pods remain attached with visible slots | three cargo slots fill once | “Cargo rack online. Supplies are organized.” | cargo icon + `Lists online` | filled slots appear without motion |
| 08 — functions | Reuse skills | Skill-module bay | Interchangeable module ports appear on shoulders | one module docks with a restrained click/glow | “Skill bay online. I can reuse tested procedures.” | module icon + `Functions online` | docked module shown immediately; no glow pulse |
| 09 — dictionaries / data | Explore planets using structured data | Planetary data atlas | Wrist display shows labeled planet record | one planet record resolves from scan marks | “Data atlas online. Planet records are structured.” | data-card icon + `Planet data online` | static labeled data card |
| 10 — `random` | Respond to random events | Probability sensor | Small event beacon and dice/star marks appear | beacon selects one of several marks once | “Event sensor online. I can handle surprises.” | event icon + `Random events online` | selected mark appears instantly; no cycling |
| 11 — project assembly | Prepare launch by combining systems | Launch integration harness | Visible links connect all prior modules; back thrusters arm | modules acknowledge once in ordered checklist | “Launch systems linked. Preflight checks pass.” | checklist icon + `Launch systems linked` | full checked list appears at once |
| 12 — final project | Complete Mission to Andromeda | Andromeda navigation core | Gold-cyan navigation core, mission insignia, and all modules remain visible | one contained route projection and energy bloom | “Andromeda route complete. Every system worked together.” | insignia icon + `Andromeda ready` | static route and insignia; optional ≤100ms fade |

## Progress and presentation rules

- Display the newest module prominently and prior modules quietly; never remove earlier upgrades.
- Locked future modules may appear as labeled silhouettes only when doing so does not reveal hidden rewards. Use lock icon + “Future module,” not grayscale alone.
- The compact RobotStatusPanel uses robot/module icon, capability label, status copy, and `Session n of 12`. It must remain meaningful without illustration.
- Unlock copy names the capability, not the child’s intelligence. Say “Scanner calibrated,” not “You’re a genius.”
- Incomplete work produces neutral debugging language: “Signal incomplete. Which value changed?” Never “Wrong,” “failed,” or “You should know this.”
- R0-B0 hints never expose final mission code, pretend to execute code, or interrupt typing. Hints open only by learner request or a clearly dismissible teacher-configured prompt.
- Celebration is contained to the robot panel, runs once, and never blocks navigation, submission feedback, or teacher review.
- Under `prefers-reduced-motion: reduce`, remove tilt, scan, rotation, docking, particles, route drawing, and energy bloom. Use immediate state replacement or a fade no longer than 100ms. Status copy and persistent module change carry all meaning.
- Robot art is decorative when adjacent text conveys capability; use empty alt. If artwork itself is the only identity cue, use concise alt such as “R0-B0 with memory core installed.”
