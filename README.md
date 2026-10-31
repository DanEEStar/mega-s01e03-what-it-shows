# #4471 split: one ticket, two problems

The support desk merged 412 reports about dates into ticket #4471 and marked it known, with one fix
queued. This repo holds the kb export as it came, the two tickets that #4471 actually needs, and the kb
page that says why.

## The tickets

| problem | reports | tenants | ticket |
|---|---|---|---|
| `parser` — the shared parser reads dates month-first for tenants that write the day first | 379 | 11 | [#1](https://github.com/DanEEStar/mega-s01e03-what-it-shows/issues/1) |
| `hint` — booking-v3 prints `MM/DD/YYYY` to a day-first tenant and reads the answer that way | 33 | 3 | [#2](https://github.com/DanEEStar/mega-s01e03-what-it-shows/issues/2) |

379 + 33 = 412. The export holds 427 rows, because its pages overlap; 15 rows repeat one report id.

## The kb page

- source: `src/routes/kb/incidents/4471-split/+page.svx`
- the page as the desk will see it: [`rendered/4471-split.html`](rendered/4471-split.html) — one file,
  styles inlined, opens without a server
- counts and tenants are computed by `src/lib/kb/ProblemTable.svelte` from `src/lib/data/reports-4471.json`
  and the tenant files at render time. No number in the page is typed.

## Build

```
npm install
npm run build     # prerenders every kb page into build/
npm run render    # writes the self-contained rendered/4471-split.html
```

The zip arrived as `src/` only, so `package.json`, `svelte.config.js`, `vite.config.js`,
`src/routes/+layout.js` and the `#lib` alias were added to make the export build. The desk's own files
under `src/lib/kb`, `src/lib/data` and the existing pages are unchanged.

## The split, in one line

A report's cause comes from its tenant — the tenant's locale and which booking form it runs — never from
the reporter's browser locale, which is what intake tags.
