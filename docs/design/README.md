# Galaxy Robot Academy Design System

This knowledge base defines visual, interaction, content, and accessibility foundations for Galaxy Robot Academy. Goal: **professional enough for adults, magical enough for children**.

## Authority and use

Product and academy intent come from [`../WEBSITE_PRD.md`](../WEBSITE_PRD.md) and [`../ACADEMY_FOUNDATION.md`](../ACADEMY_FOUNDATION.md). Engineering constraints come from [`../engineering/ENGINEERING_CONSTITUTION.md`](../engineering/ENGINEERING_CONSTITUTION.md) and its companion standards. This directory is authoritative for UI decisions. If documents conflict: approved work order, Engineering Constitution, product/academy intent, then this design system. Escalate unresolved product or architecture conflicts; do not invent policy.

Documentation specifies intent and contracts; implementation must still validate browser behavior, accessibility, and repository conventions. New UI work must:

1. Start with semantic tokens from [Color](COLOR_SYSTEM.md), [Typography](TYPOGRAPHY.md), and [Layout](LAYOUT_SYSTEM.md).
2. Reuse components defined in [Design System](DESIGN_SYSTEM.md) and [Component Guidelines](COMPONENT_GUIDELINES.md).
3. Follow [Interaction](INTERACTION_GUIDELINES.md), [Motion](ANIMATION_GUIDELINES.md), and [Accessibility](ACCESSIBILITY_GUIDELINES.md).
4. Apply route intent from [Page Blueprints](PAGE_BLUEPRINTS.md).
5. Add page-specific styling only when no reusable token or component can express requirement; document new pattern before repetition.

Design tokens and shared components outrank copied utility strings and route-local visual inventions. `packages/ui` owns reusable, domain-neutral UI. `apps/web/components` owns Academy workflows and domain composition.

## Documents

- [UI Audit](UI_AUDIT.md)
- [Brand Guide](BRAND_GUIDE.md)
- [Design System](DESIGN_SYSTEM.md)
- [Color System](COLOR_SYSTEM.md)
- [Typography](TYPOGRAPHY.md)
- [Visual Language](VISUAL_LANGUAGE.md)
- [Layout System](LAYOUT_SYSTEM.md)
- [Component Guidelines](COMPONENT_GUIDELINES.md)
- [Interaction Guidelines](INTERACTION_GUIDELINES.md)
- [Animation Guidelines](ANIMATION_GUIDELINES.md)
- [Accessibility Guidelines](ACCESSIBILITY_GUIDELINES.md)
- [Iconography](ICONOGRAPHY.md)
- [Illustration Guidelines](ILLUSTRATION_GUIDELINES.md)
- [R0-B0 Personality](ROBOT_PERSONALITY.md)
- [Content Tone](CONTENT_TONE.md)
- [Page Blueprints](PAGE_BLUEPRINTS.md)
