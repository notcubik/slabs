<script lang="ts">
	import { notes } from '$lib/stores/notes.js';
	import { getNoteColor, getVividColor } from '$lib/utils/colors.js';
	import { getIsDarkMode } from '$lib/utils/theme.svelte.js';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Bell from 'lucide-svelte/icons/bell';
	import Calendar from 'lucide-svelte/icons/calendar';

	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let selectedDate = $state<string | null>(null);

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];
	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const reminderNotes = $derived(
		$notes.filter((n) => n.reminderAt && !n.trashed && !n.archived)
	);

	const daysInMonth = $derived(new Date(currentYear, currentMonth + 1, 0).getDate());
	const firstDayOfWeek = $derived(new Date(currentYear, currentMonth, 1).getDay());

	const calendarDays = $derived(() => {
		const days: { day: number | null; dateKey: string }[] = [];
		for (let i = 0; i < firstDayOfWeek; i++) {
			days.push({ day: null, dateKey: '' });
		}
		for (let d = 1; d <= daysInMonth; d++) {
			const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			days.push({ day: d, dateKey });
		}
		return days;
	});

	function notesForDate(dateKey: string) {
		return reminderNotes.filter((n) => {
			if (!n.reminderAt) return false;
			const d = new Date(n.reminderAt);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
			return key === dateKey;
		});
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
		selectedDate = null;
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
		selectedDate = null;
	}

	function isToday(day: number) {
		const now = new Date();
		return day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
	}

	function formatReminderTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	const selectedDateNotes = $derived(selectedDate ? notesForDate(selectedDate) : []);

	const isDark = $derived(getIsDarkMode());
</script>

<svelte:head>
	<title>Reminders — slabs</title>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-[var(--text)] font-display flex items-center gap-2">
			<Bell class="h-6 w-6 text-[var(--primary)]" />
			Reminders
		</h1>
		<p class="mt-1 text-sm text-[var(--text-muted)]">
			{reminderNotes.length} note{reminderNotes.length !== 1 ? 's' : ''} with reminders
		</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr,280px]">
		<!-- Calendar -->
		<div class="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--card-shadow)]">
			<!-- Month navigation -->
			<div class="mb-4 flex items-center justify-between">
				<button onclick={prevMonth} class="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--text)] transition-colors">
					<ChevronLeft class="h-5 w-5" />
				</button>
				<h2 class="text-lg font-semibold text-[var(--text)]">
					{monthNames[currentMonth]} {currentYear}
				</h2>
				<button onclick={nextMonth} class="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--text)] transition-colors">
					<ChevronRight class="h-5 w-5" />
				</button>
			</div>

			<!-- Day headers -->
			<div class="grid grid-cols-7 gap-1 mb-1">
				{#each dayNames as day}
					<div class="py-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
						{day}
					</div>
				{/each}
			</div>

			<!-- Calendar grid -->
			<div class="grid grid-cols-7 gap-1">
				{#each calendarDays() as { day, dateKey }}
					{#if day === null}
						<div class="aspect-square"></div>
					{:else}
						{@const dayNotes = notesForDate(dateKey)}
						<button
							onclick={() => selectedDate = selectedDate === dateKey ? null : dateKey}
							class="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-all duration-150 relative {selectedDate === dateKey ? 'bg-[var(--primary-subtle)] ring-1 ring-[var(--primary)]' : 'hover:bg-[var(--bg-surface-alt)]'} {isToday(day) ? 'font-bold text-[var(--primary)]' : 'text-[var(--text)]'}"
						>
							{day}
							{#if dayNotes.length > 0}
								<div class="flex gap-0.5">
									{#each dayNotes.slice(0, 3) as n}
										<span class="h-1.5 w-1.5 rounded-full" style="background-color: {getVividColor(n.color, isDark).bg}"></span>
									{/each}
								</div>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Sidebar: selected date or upcoming -->
		<div class="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]">
			{#if selectedDate}
				<h3 class="mb-3 text-sm font-semibold text-[var(--text)] flex items-center gap-1.5">
					<Calendar class="h-4 w-4 text-[var(--primary)]" />
					{new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
				</h3>
				{#if selectedDateNotes.length === 0}
					<p class="text-xs text-[var(--text-muted)]">No reminders on this day</p>
				{:else}
					<div class="space-y-2">
						{#each selectedDateNotes as n}
							<a
								href="/?note={n.id}"
								class="block rounded-lg border border-[var(--border-subtle)] p-3 hover:shadow-[var(--card-shadow-hover)] transition-shadow"
								style="background-color: {getNoteColor(n.color, isDark)}"
							>
								<p class="text-sm font-medium text-[var(--text)] truncate">{n.title || 'Untitled'}</p>
								{#if n.reminderAt}
									<p class="mt-1 text-[10px] text-[var(--text-muted)]">
										{formatReminderTime(new Date(n.reminderAt))}
									</p>
								{/if}
							</a>
						{/each}
					</div>
				{/if}
			{:else}
				<h3 class="mb-3 text-sm font-semibold text-[var(--text)]">Upcoming</h3>
				{@const upcoming = reminderNotes
					.filter((n) => n.reminderAt && new Date(n.reminderAt) >= new Date())
					.sort((a, b) => new Date(a.reminderAt!).getTime() - new Date(b.reminderAt!).getTime())
					.slice(0, 8)}
				{#if upcoming.length === 0}
					<p class="text-xs text-[var(--text-muted)]">No upcoming reminders</p>
				{:else}
					<div class="space-y-2">
						{#each upcoming as n}
							<a
								href="/?note={n.id}"
								class="block rounded-lg border border-[var(--border-subtle)] p-3 hover:shadow-[var(--card-shadow-hover)] transition-shadow"
								style="background-color: {getNoteColor(n.color, isDark)}"
							>
								<p class="text-sm font-medium text-[var(--text)] truncate">{n.title || 'Untitled'}</p>
								{#if n.reminderAt}
									<p class="mt-1 text-[10px] text-[var(--text-muted)]">
										{new Date(n.reminderAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {formatReminderTime(new Date(n.reminderAt))}
									</p>
								{/if}
							</a>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
