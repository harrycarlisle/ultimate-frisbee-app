# References

## Understand Anything

Reference: <https://github.com/Egonex-AI/Understand-Anything>

Use this as a Cursor/codebase-understanding helper if it is available. It can help answer questions like:

- where routes are defined
- where player line labels are mapped
- where selected-player instructions render
- where score/confetti behavior triggers
- how a diff affects the lesson flow

Do not wire it into app runtime. Do not commit local scratch output unless a task explicitly asks for that artifact.

## Avoid AI Writing

Reference: <https://github.com/conorbronsdon/avoid-ai-writing>

Use these principles as a copy-quality check. App copy should sound like a coach talking to beginners:

- direct
- tactical
- short
- specific
- human

Avoid generic AI phrases and overexplaining.

## Graphology

Reference: <https://graphology.github.io/>

Graphology is a strong JavaScript graph library. This app does not need it yet. Use graph ideas for team data and line mapping, but do not add the dependency while the app remains a static single-file page.

## Ultimate Analytics

Reference: <https://github.com/marcwagn/ultimate_analytics>

This project shows how ultimate video can become a tactical board using player detection/tracking and a bird's-eye visualization.

Use it as inspiration for future film review and team-data features:

- upload a clip and map players to pucks
- compare real spacing to lesson spacing
- turn real possessions into teachable animations
- use player tracking to create team-specific drills
- create a "film to formation" workflow
- validate whether practice lessons match real ultimate movement

Do not add YOLO, Kedro, Streamlit, Python pipelines, or ML dependencies to this app unless we intentionally start a separate analytics project.

If a future task references Ultimate Analytics, first confirm whether it is:

1. a lightweight teaching-app feature, or
2. a separate video-analysis/ML feature.

Keep those separate unless explicitly told otherwise.
