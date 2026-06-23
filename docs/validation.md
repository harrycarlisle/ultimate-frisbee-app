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

Do not claim "works on every phone." Use:

> Passed representative mobile coverage across small, standard, and large phone viewports.

### Mobile viewport matrix

Tiny phone:

- `320x568`
- `360x640`
- `375x667`

Standard iPhone:

- `390x844`
- `393x852`
- `414x896`

Large phone:

- `430x932`
- `480x915`

Short-height stress test:

- narrow width with `600-667px` height

Browser behavior:

- iOS Safari or Safari-like viewport if available
- Android Chrome or Chrome mobile emulation
- touch interaction
- reduced-motion mode

### Mobile checks per viewport

- No horizontal scroll.
- Practice / Line / View controls are usable.
- Edit roster does not overlap controls.
- Field fits.
- Pucks are readable.
- Disc glow is visible.
- Route lines are visible.
- Step card is readable.
- Controls are tappable.
- Score/confetti does not block the UI.
- Selected-player notes are readable.
- Step 1 pull animation works unless reduced-motion is enabled.
- Next nudge works only when sessionStorage is clear.
- Vertical Stack final score works.
- Breaking the Cup final score works.
- Horizontal Stack, Endzone Basics, Give-and-go Flow, and drills load.
- No removed UI appears.
- No app console errors.

### Reporting mobile-only bugs

If a bug appears on only one viewport, report:

- viewport size
- browser/emulation used
- exact step/practice
- screenshot if possible
- severity: blocker, important, or polish

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
