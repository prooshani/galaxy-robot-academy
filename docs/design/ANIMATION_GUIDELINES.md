# Animation Guidelines

Motion explains change, preserves orientation, and rewards progress. It never simulates system activity or competes with reading.

| Token | Duration | Use |
| --- | --- | --- |
| instant | 120ms | press/focus color |
| fast | 180ms | hover, chip |
| standard | 260ms | panel/disclosure |
| emphasis | 420ms | earned milestone |

Easing: enter `cubic-bezier(.2,.8,.2,1)`, exit `cubic-bezier(.4,0,1,1)`, movement `cubic-bezier(.4,0,.2,1)`. Page transition: opacity + 8px translate, maximum 260ms; never delay content. Cards rise 2px on pointer hover. Progress interpolates from previous value, not zero. Badge unlock uses one scale/glow pulse under 700ms. R0-B0 may blink/tilt once on state change. Mission completion uses one contained burst, no full-screen flashing.

Starfield may drift only in non-reading hero regions, very slowly, GPU-friendly transform, low opacity. Stop behind forms/code/long copy. Avoid continuous parallax, animated blur, layout properties, and multiple simultaneous loops.

Under `prefers-reduced-motion: reduce`, remove nonessential transforms, particles, drift, and auto-animated progress; use instant state changes or short fades ≤100ms. Never require motion to understand status.
