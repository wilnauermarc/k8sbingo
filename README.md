# KubernetesBingo

Hands-on Kubernetes practice as a 5×5 bingo board.

Complete real cluster challenges in your own local environment (kind, k3d, Minikube, …), mark fields as done, and chase bingo lines. Progress stays in the browser — there is **no backend**, and completion is **self-reported** (not auto-verified).

**Live demo:** [k8sbingo.netlify.app](https://k8sbingo.netlify.app)

## Features

- Responsive 5×5 bingo board (horizontal scroll on small screens)
- 70+ seeded Kubernetes challenges across common topics
- 24 random tasks per board + free center square
- Challenge detail modal with optional hint and example `kubectl` / YAML
- Visually distinct completed fields
- Automatic detection of horizontal, vertical, and diagonal bingo lines
- Celebration when a new bingo is completed
- Difficulty filter for the next board (beginner / intermediate / advanced)
- New board and reset progress, with confirmation dialogs
- Persistence via `localStorage`

## Challenge categories

Pods · Deployments · Services · ConfigMaps and Secrets · Jobs and CronJobs · Troubleshooting · Networking · Storage · Scaling · Security

## Tech stack

| Piece | Choice |
| --- | --- |
| UI | React + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide |
| Data | Static challenge seed + `localStorage` |

No backend for v1.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

```bash
npm run dev       # local development server
npm run build     # typecheck + production build
npm run preview   # serve the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  components/   # Board, cells, modal, controls, dialogs, celebration
  data/         # Challenge definitions (separate from UI)
  hooks/        # useBingoBoard — board state + localStorage
  types/        # Shared TypeScript types
  utils/        # Board generation + pure bingo detection
```

Netlify builds with `npm run build` and publishes `dist` (see `netlify.toml`).

## How to play

1. Open a board and pick a challenge.
2. Run the task in your local cluster.
3. Optionally reveal the hint or example solution.
4. Mark the field completed when you are done.
5. Complete a full row, column, or diagonal for bingo.

## Notes

- Example commands and YAML are meant to be technically valid for a typical local cluster.
- Some advanced topics (NetworkPolicy, HPA metrics, ephemeral containers) depend on your cluster setup.
- This project does **not** use the official Kubernetes logo.

## Author

Built by [Marc Wilnauer](https://marcwilnauer.de/) · [LinkedIn](https://www.linkedin.com/in/marc-w-599779252/)

## License

Personal / learning project. Use and adapt as you like.
