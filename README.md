# Scouter 9000

AI-generated baseball scouting reports. Enter your name, optionally upload a photo, and get a personalized prospect writeup with 5-tool grades on the 20-80 scale.

## How it works

1. **Writeups** — A quantized 2.7B Llama model fine-tuned on [FanGraphs](https://www.fangraphs.com) prospect coverage generates scouting narratives.
2. **Grades** — A Random Forest classifier predicts hit, power, speed, arm, and fielding grades from the generated text.
3. **Presentation** — The app randomly pairs your name/photo with one of ~1,000 pre-generated prospect profiles and renders it as a vintage scouting card.

## Stack

- React 18 + React Router 7
- Vite 6
- Tailwind CSS 4 (minimal usage — mostly custom CSS)
- Static JSON data (`ml_res.json`) — no backend required

## Setup

```
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── App.jsx              # Router config
├── main.jsx             # Entry point
├── index.css            # Global styles
├── pages/
│   ├── Home.jsx         # Name/photo input form
│   ├── Profile.jsx      # Scouting card display
│   ├── Profile.css      # Card styles
│   └── About.jsx        # Project info
├── ui/
│   ├── AppLayout.jsx    # Shell layout + outlet
│   └── Header.jsx       # Nav header
└── services/
    └── prospects.js     # Prospect data lookup
```

## Acknowledgments

Training data sourced from [FanGraphs](https://www.fangraphs.com) prospect writeups. Consider supporting their work with a [FanGraphs membership](https://plus.fangraphs.com/product/fangraphs-membership/).
