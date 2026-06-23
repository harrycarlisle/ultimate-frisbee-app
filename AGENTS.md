# AGENTS.md

## Repo scope rules

- Work only in `harrycarlisle/ultimate-frisbee-app` unless explicitly told otherwise.
- The default app file is `index.html` unless the repo structure changes.
- Do not touch other repos.
- Do not re-add removed UI:
  - Drills dropdown
  - Animated Drill Guide modal
  - source/documentation modal
- Do not do broad rewrites for tiny visual bugs.
- Prefer one focused change per task.

## App principles

- This is a mobile-first ultimate frisbee learning app.
- Visuals must match copy.
- Every route line must earn its place.
- No random route fragments.
- No route should pass through defenders if copy says the throw is open.
- Read/setup steps should not add extra blue routes.
- Defender routes should be rare and only used when they teach something.
- Puck movement should match the shown route.
- If a player catches in the attacking end zone, the app can trigger a score celebration.
- Keep celebrations quick and tasteful.

## Beginner copy rules

- One clear action per step.
- Say who has the disc.
- Say who moves.
- Say what to notice.
- Say why it matters.
- Use contractions.
- Avoid jargon unless it is explained.
- Prefer "after you throw, move" over "maintain flow."
- Prefer "safe reset" over "reset structure."
- Prefer "open lane" over "attack space."

## Avoid AI Writing checklist

Before shipping user-facing copy, check for:

- stiff wording
- generic AI phrases
- too much explanation
- jargon
- overlong sentences
- repeated title/body wording
- vague words like space, flow, pressure, or structure unless they are explained clearly

Avoid words and phrases like:

- delve
- unlock
- elevate
- seamless
- robust
- leverage
- utilize
- in today's fast-paced world
- important to note
- game-changer
- comprehensive
- empower
- transform your experience

## Hermes-style GitHub review workflow

For every contributor change:

- summarize exact files changed
- summarize user-facing behavior affected
- flag risky coordinate or route changes
- verify desktop
- verify representative mobile coverage across small, standard, and large phone viewports
- verify Line 1
- verify Line 2
- verify selected-player view
- verify score triggers
- verify no removed UI returned
- verify no console errors
- verify deployment freshness after push

## Deployment rules

Live deploys have been stale before. Before saying live is correct:

- verify current HEAD
- verify `origin/main`
- verify working tree is clean
- verify local source hash
- verify live source hash
- verify live contains expected changed strings or rendered route paths
- use a cache-busting URL for live validation
- confirm live behavior, not just local behavior

The current observed deploy path is Netlify auto-deploy from `main`. Do not create a new deploy system unless explicitly asked.

## Team data and line mapping rules

- Do not hardcode Line 1 names into reusable route logic.
- Use roles where possible.
- The same play should work for Line 1 and Line 2.
- Player names, initials, chips, and selected-player instructions should resolve from the selected line.
- Uploaded team data should be validated before it changes app state.

## Understand Anything

Use Understand Anything as a codebase-understanding helper if it is available in the environment. Do not wire it into the app runtime. Do not commit generated graph or scratch files unless a task explicitly asks for that output.

If the plugin or commands are not available, say so and continue with normal repo inspection.

## Graphology

Use the graph model concept for team data and role mapping. Do not add `graphology` as a dependency unless the repo gains a dependency workflow and graph operations become clearly useful.

## Ultimate Analytics reference

`marcwagn/ultimate_analytics` shows how ultimate video can become a tactical board using player detection/tracking and a bird's-eye visualization. For now, use it as inspiration for future film review and team-data features. Do not add its ML/video pipeline to this app unless we intentionally start a separate analytics project.

Future ideas:

- upload a clip and map players to pucks
- compare real spacing to lesson spacing
- turn real possessions into teachable animations
- use player tracking to create team-specific drills
- create a "film to formation" workflow
- validate whether practice lessons match real ultimate movement

If a future task references Ultimate Analytics, first confirm whether it is:

1. a lightweight teaching-app feature, or
2. a separate video-analysis/ML feature.

Keep those separate unless explicitly told otherwise.
