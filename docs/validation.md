# Validation Checklist

## Before commit

- Run a JS syntax check.
- Run `git diff --check`.
- Desktop smoke test.
- Mobile smoke test.
- Check for console errors.
- Confirm removed UI was not reintroduced:
  - Drills dropdown
  - Animated Drill Guide modal
  - source/documentation modal

## Lesson validation

- Step card matches the field.
- Disc chip matches the actual disc holder.
- Route lines match movement.
- No stale route fragments remain after changing steps.
- No unsafe throws pass through defenders when copy says the throw is open.
- Setup/read steps are not cluttered.
- Copy is clear for beginners.

## Vertical Stack final scoring validation

- Step 20: Antonio leads Richard wide.
- Step 21: Kristin goes upfield first, then right.
- D7 trails Kristin.
- Richard releases early.
- The disc leads Kristin.
- Kristin catches inbounds.
- The catch happens in the attacking end zone.
- Score celebration triggers.
- No Kira reset appears after the score.

## Line validation

- Line 1 labels are correct.
- Line 2 labels are correct.
- No Line 1 names leak into Line 2 unless the roster says so.
- Disc / Reset / Next chips update.
- Selected-player notes update.
- Route logic remains shared.

## Mobile validation

- Field fits.
- Dropdowns are usable.
- Controls are tappable.
- Cards are readable.
- Player instruction tag is readable.
- Score/confetti does not block the UI.
- No horizontal scroll unless intentional.
- Mobile final score sequence is still readable.

## Deploy validation

- Confirm branch.
- Confirm HEAD.
- Confirm `origin/main`.
- Confirm live source hash.
- Confirm live source contains expected strings.
- Confirm live rendered behavior.
- Use a cache-busting URL.
- Report final live URL checked.

## Live freshness checks

Because live has been stale before:

- compare local `index.html` SHA256 to live source SHA256
- use no-cache headers
- add a cache-busting query string
- check live DOM state, not just source strings
- verify the final URL you checked
