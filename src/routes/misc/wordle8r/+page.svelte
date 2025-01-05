<script>
	import { onMount } from 'svelte';
	import { words } from './words.js';
	import '$lib/css/app.css';

	let currentRow = $state(0);
	let grid = $state(Array.from({ length: 6 }, () => Array(5).fill('')));

	onMount(() => {
		const firstInput = document.querySelector(`input[name="00"]`);
		if (firstInput) {
			firstInput.focus();
		}
	});
</script>

<div class="container pt-4">
	<div class="left-column">
		<div class="grid">
			{#each Array.from(Array(6).keys()) as row (row)}
				<div class:hide={row > currentRow} class:show={row <= currentRow}>
					<div class="row mt-4">
						{#each Array.from(Array(5).keys()) as col (col)}
							<div class="cell">
								<div class="letter">
									<input autocomplete="off" name={`${row}${col}`} type="text" maxlength="1" />
								</div>
							</div>
						{/each}
						{#if row < 5}
							<button onclick={() => (currentRow = row + 1)}>Next</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="right-column">right</div>
</div>

<style lang="scss">
	.container {
		max-width: min(100vw, 30rem, 50rem);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-inline: auto;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid red;

		.row {
			align-items: center;
			display: flex;
			gap: 0;
			justify-content: start;
		}

		.cell {
			margin-inline: 0.25rem;
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0;
			width: 3rem;
		}

		.letter {
			align-items: center;
			background-color: white;
			display: flex;
			height: 3rem;
			justify-content: center;
			aspect-ratio: 1;
			border: 3px solid #aaa;
			font-size: 2rem;
			color: black;
			border-radius: 0.5rem;
			margin-inline: 0.5rem;

			&:focus-within {
				border: none;
			}
		}

		input {
			width: 100%;
			height: 100%;
			background-color: inherit;
			box-shadow: var(--shadow-6);
			outline: none;
			text-align: center;
			padding: 0;
			padding-block-end: 0.25rem;
			margin: 0;
			// caret-color: transparent;

			&:focus {
				border: 3px solid #090;
				outline: none;
			}
		}
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid red;
	}
	.show {
		display: block;
	}
	.hide {
		display: none;
	}
</style>
