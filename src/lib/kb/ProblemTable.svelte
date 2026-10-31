<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, readAs, uniqueById, type CauseGroup, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  // One ticket per cause, so the table is built from the data: no count is typed here.
  let {
    ticket = 4471,
    issues = {},
    labels = {},
  }: { ticket?: number; issues?: Record<string, string>; labels?: Record<string, string> } = $props();

  const rows = reports as Report[];
  const merged = $derived(uniqueById(rows).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));

  const tenantsOf = (g: CauseGroup) => [...new Set(g.reports.map((r) => r.tenant))].sort();
  const misTagged = (g: CauseGroup) =>
    Object.entries(g.taggedAs)
      .filter(([tag]) => tag !== g.cause)
      .reduce((n, [, count]) => n + count, 0);
  const misTaggedAll = $derived(groups.reduce((n, g) => n + misTagged(g), 0));

  // The ticket link is the repo's issue url; show the issue number, not the cause name.
  const issueNumber = (url: string) => url.replace(/\/$/, '').split('/').pop();
</script>

<p class="sum">
  <strong>{rows.length}</strong> export rows · <strong>{merged.length}</strong> unique reports merged into
  #{ticket} · <strong>{groups.length}</strong>
  {groups.length === 1 ? 'cause' : 'causes'} · <strong>{misTaggedAll}</strong> reports tagged by intake as
  the other cause
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td>
          <code>{g.cause}</code>
          {#if labels[g.cause]}<br /><span class="what">{labels[g.cause]}</span>{/if}
        </td>
        <td class="n">{g.reports.length}</td>
        <td>{g.tenants} · <span class="small">{tenantsOf(g).join(', ')}</span></td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
        <td>
          {#if issues[g.cause]}
            <a href={issues[g.cause]}>issue #{issueNumber(issues[g.cause])}</a>
          {:else}
            <span class="missing">not filed</span>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {@const moved = readAs(g, notes.oneDayMove)}
  {#if moved}
    <p class="note">
      {moved} of these {g.reports.length} were read by the desk as a one-day move, not a month flip. They are
      counted under <code>{g.cause}</code>, where the desk filed them, and the count above includes them.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.02rem; }
  .n { font-variant-numeric: tabular-nums; }
  .small { font-size: 0.85em; color: var(--muted); }
  .what { font-size: 0.85em; color: var(--muted); }
  .note { color: var(--muted); font-size: 0.85rem; }
  .missing { color: var(--warn); }
</style>
