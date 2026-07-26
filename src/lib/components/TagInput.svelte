<script lang="ts">
  import { X } from 'lucide-svelte';

  interface Props {
    tags: string[];
    onchange: (tags: string[]) => void;
  }

  let { tags = $bindable(), onchange }: Props = $props();
  let inputValue = $state('');
  let allExistingTags = $state<string[]>([]);
  let showAutocomplete = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  $effect(() => {
    fetch('/api/tags')
      .then(r => r.ok ? r.json() : [])
      .then(data => { allExistingTags = data.map((t: any) => t.name); })
      .catch(() => {});
  });

  let filteredTags = $derived(
    inputValue.trim()
      ? allExistingTags.filter(
          t => t.toLowerCase().includes(inputValue.trim().toLowerCase()) &&
               !tags.includes(t)
        )
      : []
  );

  function addTag(name: string) {
    const cleaned = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (cleaned && !tags.includes(cleaned)) {
      tags = [...tags, cleaned];
      onchange(tags);
    }
    inputValue = '';
    showAutocomplete = false;
  }

  function removeTag(name: string) {
    tags = tags.filter(t => t !== name);
    onchange(tags);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      showAutocomplete = false;
    }
  }

  function handleInput() {
    const match = inputValue.match(/#([\w-]+)$/);
    if (match) {
      inputValue = match[1];
    }
    showAutocomplete = filteredTags.length > 0;
  }
</script>

<div class="flex flex-wrap items-center gap-1.5">
  {#each tags as tag}
    <span class="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
      #{tag}
      <button onclick={() => removeTag(tag)} class="hover:text-[var(--destructive)]" aria-label="Remove tag {tag}">
        <X size={12} />
      </button>
    </span>
  {/each}
  <div class="relative">
    <input
      bind:this={inputEl}
      type="text"
      bind:value={inputValue}
      onfocus={() => { if (filteredTags.length > 0) showAutocomplete = true; }}
      onblur={() => { setTimeout(() => { showAutocomplete = false; }, 150); }}
      oninput={handleInput}
      onkeydown={handleKeydown}
      placeholder={tags.length === 0 ? 'Add tags...' : ''}
      class="w-20 min-w-[5rem] bg-transparent text-xs text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
      data-testid="tag-input"
    />
    {#if showAutocomplete && filteredTags.length > 0}
      <div class="absolute left-0 top-full z-50 mt-1 max-h-32 w-40 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] py-1 shadow-[var(--card-shadow)]">
        {#each filteredTags.slice(0, 8) as tag}
          <button
            onmousedown={() => addTag(tag)}
            class="w-full px-2 py-1 text-left text-xs text-[var(--text)] hover:bg-[var(--border-subtle)]"
          >
            #{tag}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
