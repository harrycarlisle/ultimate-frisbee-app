# Team Data Graph Model

## Purpose

Make Line 1, Line 2, uploaded rosters, selected-player views, and shared route scripts safer.

This is a lightweight model for how to think about team data. It is not a new runtime dependency.

## Nodes

- `Player`
- `Line`
- `Role`
- `Formation`
- `Step`
- `Instruction`
- `UploadedRoster`
- `Route`
- `DiscAction`

## Edges

- `Player belongs_to Line`
- `Player fills Role`
- `Role appears_in Step`
- `Step belongs_to Formation`
- `Instruction targets Role`
- `UploadedRoster updates Line`
- `Step uses Route`
- `DiscAction targets Role`

## Core principle

Routes and coordinates belong to roles.

Names and initials belong to the selected line.

Vertical Stack should not mean:

> Kira always does X.

It should mean:

> handler1 does X, then resolve handler1 to Kira on Line 1 or the Line 2 handler on Line 2.

## Why this helps

- Line 2 can reuse Line 1 choreography.
- Player labels can change without breaking routes.
- Selected-player instructions can resolve cleanly.
- Team uploads can be validated before they affect the lesson.
- Contributor changes can be reviewed more safely.
- Future teams can use the same lessons with their own players.

## Current lightweight mapping

The current app maps stable IDs to the selected line:

- `A` = handler1
- `B` = handler2
- `C` = cutter1
- `D` = cutter2
- `E` = cutter3
- `F` = cutter4
- `G` = cutter5

Route coordinates should stay attached to these role IDs. Display names and initials should come from the active roster.

## Uploaded team data validation

Before uploaded team data changes app state, validate:

- no blank names
- initials generated safely
- duplicate initials handled
- each line has enough players
- required roles filled
- unknown players rejected or warned
- selected-player instructions still resolve
- Disc / Reset / Next chips still point to valid role IDs

## Review checklist for team-data changes

- Does Line 1 still render the same lesson?
- Does Line 2 render the same route logic with Line 2 names?
- Does selected-player view show the selected line's player name?
- Do player initials stay readable?
- Does changing Line reset selected-player state safely?
- Do uploaded extras replace the intended role without breaking the step?

## Graphology decision

Graphology is useful when graph operations are part of the app. This repo is currently a static single-file teaching app with no package workflow. Use the graph model concept now. Do not install Graphology yet.
