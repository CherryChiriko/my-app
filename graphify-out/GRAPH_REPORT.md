# Graph Report - revu-app  (2026-09-04)

## Corpus Check
- 182 files · ~134,067 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 582 nodes · 1360 edges · 33 communities (29 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df014016`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- activitySlice.js
- App.js
- deckSlice.js
- dependencies
- constants.js
- useStudySession.js
- SettingsPage.jsx
- settingsSlice.js
- userSlice.js
- CompactVariant.jsx
- ImportView.jsx
- CardRenderer.jsx
- CardGridSection.jsx
- Learn More
- manifest.json
- cardMastery.js
- xp.js
- seed.js
- README.md
- Onbo.jsx
- userProgress.js
- README.md
- capacitor.config.ts

## God Nodes (most connected - your core abstractions)
1. `supabase` - 32 edges
2. `selectActiveTheme()` - 21 edges
3. `selectUserProfile()` - 21 edges
4. `useStudySession()` - 19 edges
5. `getTodayISO()` - 18 edges
6. `selectDecks()` - 17 edges
7. `inputCls()` - 16 edges
8. `App()` - 15 edges
9. `selectSettings()` - 15 edges
10. `useActivityAnalytics()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `TourModal()` --references--> `react`  [EXTRACTED]
  src/components/General/ui/TourModal.jsx → package.json
- `AvatarPick()` --references--> `react`  [EXTRACTED]
  src/components/Settings/components/AvatarPick.jsx → package.json
- `useImportLogic()` --references--> `xlsx`  [EXTRACTED]
  src/components/Import/hooks/useImportLogic.js → package.json
- `SpotlightTourModal()` --references--> `@capacitor/app`  [EXTRACTED]
  src/components/General/ui/SpotlightTourModal.jsx → package.json
- `TourModal()` --references--> `@capacitor/app`  [EXTRACTED]
  src/components/General/ui/TourModal.jsx → package.json

## Import Cycles
- None detected.

## Communities (33 total, 4 thin omitted)

### Community 0 - "activitySlice.js"
Cohesion: 0.10
Nodes (18): DeckCardItem(), DEFAULT_COUNTS, useDeckLogic(), DecksLoader(), StatsLoader(), fetchDecks, progressSlice, TABLES (+10 more)

### Community 1 - "App.js"
Cohesion: 0.08
Nodes (39): react, App(), resetAllUserState(), themes, Dashboard(), StatCard(), DeckDetails(), DeckCard() (+31 more)

### Community 2 - "deckSlice.js"
Cohesion: 0.13
Nodes (23): formatDuration(), getRecentDays(), useActivityAnalytics(), ActivityPage(), useListController(), useDeckLiveSync(), selectActiveDaysCount, selectTotalActivity (+15 more)

### Community 3 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bootstrap, @capacitor/android, @capacitor/browser, @capacitor/core, @codetrix-studio/capacitor-google-auth, date-fns, @fortawesome/fontawesome-svg-core (+24 more)

### Community 4 - "constants.js"
Cohesion: 0.08
Nodes (34): CardEdit(), CardDetails(), AddCardMenu(), INITIAL_FIELDS, useAddCard(), FormField(), inputCls(), selectCls() (+26 more)

### Community 5 - "useStudySession.js"
Cohesion: 0.05
Nodes (55): checkMidnightReset(), previousPersistedSettings, IMPORTANT: useAuth clears localStorage BEFORE dispatching this, so that, store, useCardDetails(), generateCalendarGrid(), Heatmap(), useBulkCardActions() (+47 more)

### Community 6 - "SettingsPage.jsx"
Cohesion: 0.11
Nodes (18): AvatarDisplay(), SettingCard(), AccountSection(), AvatarPick(), PALETTE, PRESET_AVATARS, AvatarSection(), DisplaySection() (+10 more)

### Community 7 - "settingsSlice.js"
Cohesion: 0.12
Nodes (18): @capacitor/app, SpotlightTourModal(), TourModal(), FlipCard(), DashboardTutorial(), DeckDetailsTutorial(), DeckPageTutorial(), StudyTutorial() (+10 more)

### Community 8 - "userSlice.js"
Cohesion: 0.18
Nodes (15): xlsx, useImportLogic(), SubscriptionSection(), PLAN_IDS, plans, recordImportedCards, selectSubscription(), updateSubscriptionPlan (+7 more)

### Community 9 - "CompactVariant.jsx"
Cohesion: 0.12
Nodes (15): C_LANGUAGES, DeckMetaEditor(), DeckHeaderSection(), DeckMenu(), QuickCreateMenu(), DeckActions(), DeckBadges(), ProgressBar() (+7 more)

### Community 10 - "ImportView.jsx"
Cohesion: 0.09
Nodes (20): XPBar(), Bar(), CharacterCanvas(), CharacterDemo(), FinalStep(), Step0(), Step1(), Step2() (+12 more)

### Community 11 - "CardRenderer.jsx"
Cohesion: 0.18
Nodes (8): NotFound404(), CardRenderer(), CharacterCard(), ContinueButton(), buttons, RatingButtons(), RevealButton(), useCharacterFlow()

### Community 12 - "CardGridSection.jsx"
Cohesion: 0.11
Nodes (17): CardInfo(), getCardStrengthLabel(), CardGridSection(), DeckStatsSection(), STATUS_FILTERS, STATUS_TILE, AddCardTile(), CardTile() (+9 more)

### Community 13 - "Learn More"
Cohesion: 0.12
Nodes (16): Columns, Columns, Columns, Columns, Columns, Columns, Columns, Columns (+8 more)

### Community 14 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 15 - "cardMastery.js"
Cohesion: 0.14
Nodes (13): Advanced Configuration, Analyzing the Bundle Size, Available Scripts, Code Splitting, Deployment, Getting Started with Create React App, Learn More, Making a Progressive Web App (+5 more)

### Community 16 - "xp.js"
Cohesion: 0.22
Nodes (8): browserslist, development, production, eslintConfig, extends, name, private, version

### Community 18 - "seed.js"
Cohesion: 0.40
Nodes (5): scripts, build, eject, start, test

### Community 19 - "README.md"
Cohesion: 0.50
Nodes (4): devDependencies, autoprefixer, @capacitor/assets, dotenv

## Knowledge Gaps
- **122 isolated node(s):** `config`, `name`, `version`, `private`, `@capacitor/android` (+117 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `xp.js`, `App.js`, `userSlice.js`, `settingsSlice.js`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `react` connect `App.js` to `dependencies`, `SettingsPage.jsx`, `settingsSlice.js`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `StudySession()` connect `App.js` to `deckSlice.js`, `useStudySession.js`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `selectActiveTheme()` (e.g. with `App()` and `useActivityAnalytics()`) actually correct?**
  _`selectActiveTheme()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `selectUserProfile()` (e.g. with `App()` and `useActivityAnalytics()`) actually correct?**
  _`selectUserProfile()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `useStudySession()` (e.g. with `selectCardsStatus()` and `selectLearnLimit()`) actually correct?**
  _`useStudySession()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._