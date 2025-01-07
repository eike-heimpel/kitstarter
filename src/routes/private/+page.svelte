<script lang="ts">
	let { data } = $props();
	let { session } = $derived(data);

	// Get time-based greeting
	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

	// Mock data for demonstration
	const stats = [
		{ title: 'Projects', value: '12', icon: '📊', color: 'bg-primary/10 text-primary' },
		{ title: 'Tasks', value: '34', icon: '✓', color: 'bg-secondary/10 text-secondary' },
		{ title: 'Messages', value: '5', icon: '✉️', color: 'bg-accent/10 text-accent' },
		{ title: 'Updates', value: '2', icon: '🔔', color: 'bg-info/10 text-info' }
	];

	const quickActions = [
		{ title: 'New Project', icon: '🚀', desc: 'Start a new project' },
		{ title: 'Add Task', icon: '📝', desc: 'Create a new task' },
		{ title: 'Send Message', icon: '💬', desc: 'Message team members' },
		{ title: 'View Reports', icon: '📈', desc: 'Check your analytics' }
	];

	const recentActivity = [
		{ action: 'Created new project', time: '2 hours ago', icon: '🎯' },
		{ action: 'Updated profile', time: '5 hours ago', icon: '👤' },
		{ action: 'Completed task', time: 'Yesterday', icon: '✅' }
	];
</script>

<div class="space-y-6">
	<!-- Welcome Section -->
	<div class="rounded-box bg-base-100 p-6 shadow-lg">
		<h1 class="text-4xl font-bold">
			{greeting}, <span class="text-primary">{session?.user?.email?.split('@')[0]}</span>! 👋
		</h1>
		<p class="mt-2 text-base-content/70">Here's what's happening with your projects today.</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<div class="hover-lift card bg-base-100">
				<div class="card-body">
					<div class="flex items-center gap-4">
						<div
							class="rounded-box {stat.color} flex h-12 w-12 items-center justify-center text-2xl"
						>
							{stat.icon}
						</div>
						<div>
							<div class="text-3xl font-bold">{stat.value}</div>
							<div class="text-sm text-base-content/70">{stat.title}</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Quick Actions -->
	<div class="rounded-box bg-base-100 p-6 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">Quick Actions</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each quickActions as action}
				<button class="hover-lift card bg-base-200 transition-colors hover:bg-base-300">
					<div class="card-body items-center text-center">
						<div class="text-3xl">{action.icon}</div>
						<h3 class="card-title text-lg">{action.title}</h3>
						<p class="text-sm text-base-content/70">{action.desc}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="rounded-box bg-base-100 p-6 shadow-lg">
		<h2 class="mb-4 text-2xl font-bold">Recent Activity</h2>
		<div class="space-y-4">
			{#each recentActivity as activity}
				<div class="flex items-center gap-4 rounded-lg bg-base-200 p-4">
					<div class="text-2xl">{activity.icon}</div>
					<div class="flex-1">
						<div class="font-medium">{activity.action}</div>
						<div class="text-sm text-base-content/70">{activity.time}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
