# Layout System

App shell: top navigation 64px desktop, 72–auto mobile; canvas fills viewport; content width `1200px` teacher, `1120px` general, `760px` mission reading, `680px` forms. Gutters 16px mobile, 24px tablet, 32px desktop. Full-bleed atmosphere may span viewport; interactive/readable content stays contained. Honor `env(safe-area-inset-*)`.

Desktop uses 12-column grid; tablet 8; mobile 4. Student layouts favor 2–3 broad cards. Teacher dashboard uses 12-column dense regions and horizontally scrollable tables with sticky identity/action columns when needed. Mobile navigation collapses to explicit menu; no hidden gesture.

## Wireframes

```text
HOME                 STUDENT               MISSION
[Nav]                [Nav]                 [Nav]
[Hangar hero]        [Greeting][R0-B0]     [Back][Status][Reward]
[Role/continue]      [GE][Rank][Badges]    [Briefing 760px]
[Destinations 2x2]   [Current mission]     [Tasks][Bonus]
[Footer]             [Mission timeline]    [Code + notes][Submit]

TEACHER              BADGES                ROLE
[Nav][Create]        [Nav][Progress]        [Brand/Entry gate]
[Queue stats]        [Filter/category]      [Student portal]
[Review queue]       [Unlocked grid]        [Teacher portal]
[Mission table]      [Locked silhouettes]  [Privacy/context]

MISSION CREATE/EDIT
[Nav][Back]
[Title + save state]
[Basics form 680px]
[Objectives/tasks]
[Rewards/badges]
[Cancel][Save]
```

At `<768px`, stack secondary panels below primary content; move table details into labeled cards only if data relationships remain clear. Never reorder status after action. Mission code area may scroll horizontally; page must not.
