# KubernetesBingo

A hands-on Kubernetes learning app. You get a 5×5 bingo board of practical challenges, complete them in your own local cluster (kind, k3d, Minikube, …), and mark fields as done. Progress is stored in the browser — there is no backend, and tasks are **not** auto-verified.

## Tech stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Lucide icons
- localStorage persistence

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Other scripts

```bash
npm run build    # typecheck + production build
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Project structure

```
src/
  components/     # UI: board, cells, modal, controls, dialogs
  data/           # Challenge seed data (50+ tasks)
  hooks/          # useBingoBoard (state + localStorage)
  types/          # Shared TypeScript types
  utils/          # Board generation + pure bingo detection
```

## Features

- Responsive 5×5 bingo board (horizontal scroll on small screens)
- 24 random challenges + free center square
- Challenge detail modal with optional hint and example solution
- Self-reported completion with clear completed styling
- Horizontal, vertical, and diagonal bingo detection
- Tasteful celebration when a new bingo line is completed
- New board / reset progress with confirmation
- Difficulty filter for the next board draw
# k8sbingo
