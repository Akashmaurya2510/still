# Still

Clean, calm to-do app. Liquid-glass chrome, OLED / light themes, installable as a PWA, local-only data.

## Features

- Add tasks (Enter, or press **N**)
- Star, Today, Tomorrow from the composer
- Lists: Everything, Starred, Inbox, Personal, Work
- Large All / Active / Done tabs with an animated pill
- Search
- Notes on a task
- Swipe right to complete, left to delete (with a colored reveal, like iOS Mail)
- Report view — daily/weekly stats, streaks, a 7-day bar chart, and a by-list breakdown
- Progress indicator in the header, theme toggle (OLED / Light)
- Profile name shown in greetings and on the report
- Export / import a JSON backup from Settings
- Installable to the home screen (PWA); works fully offline
- Saved in your browser (localStorage)

## Run

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Open http://127.0.0.1:8080

## Build

\`\`\`bash
pnpm build
pnpm preview
\`\`\`

Deploys automatically to GitHub Pages on push to \`main\` (see \`.github/workflows/deploy.yml\`).

## Shortcuts

| Key | Action |
|-----|--------|
| N | Focus new task |
| Enter | Add / save |
| Esc | Cancel edit / close dialog |

## Tech

React 19, Vite 6, Tailwind CSS 4, Zustand (persisted store), vite-plugin-pwa.
