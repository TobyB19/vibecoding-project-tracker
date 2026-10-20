# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · design-done

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

A clean, high-contrast light mode. Bright and readable, specifically chosen to pass WCAG AA contrast standards for the accessibility report.

Two or three references that capture the vibe:
- Vercel light mode dashboard
- Tailwind UI default clean layouts
- Linear light theme

Anti-references:
- Cluttered, low-contrast enterprise tools
- Jira

## 2. Color palette

Picked these to hit strong contrast ratios against white/light grey backgrounds (e.g., Slate 900 text on white is 15:1, easily passing AAA).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| brand-primary | #2563eb | Header, + button, focus rings |
| brand-accent | #1d4ed8 | Highlights, hover states |
| surface-page | #f8fafc | Page background |
| surface-card | #ffffff | Card background |
| text-primary | #0f172a | Body text |
| text-muted | #475569 | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | #34d399 | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | #f87171 | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | #94a3b8 | More than 2 days out |
| `due-warning` | #fbbf24 | Less than 24 hours |
| `due-overdue` | #f87171 | Past due |
| `due-neutral` | #64748b | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | Tailwind Sans | clean and default |
| Body | Tailwind Sans | highly readable for the report |
| Monospace (tags, badges, code) | Tailwind Mono | good for code blocks |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** rounded edges, no heavy drop shadows.
- **Buttons:** solid color, changes slightly when you hover.
- **Modal:** sits in the middle with a dark overlay behind it.
- **Empty states:** grey text, dashed border.
- **Drag affordance (if used):** none, just using a dropdown for status.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | Add Task |
| Empty column placeholder | Nothing here yet. |
| Toast after "Copy as Prompt Context" | Copied to clipboard. |
| Confirm-delete message | Delete this task? |
| Handoff toast (M7 `task-owner`) | Reassigned to {name}. |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** Team Bish Tracker
- **Wordmark style:** Just plain text in the primary brand color, no logo needed.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.