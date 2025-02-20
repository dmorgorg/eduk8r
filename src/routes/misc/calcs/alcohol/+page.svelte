<script>
	import Explanation from './Explanation.svelte';
	import SGs from './SGs.svelte';
	let viewCalc = true;
	let selectedOption = 'volume';
	let weight = '';
	let sg = '1.00';
	let volume = '';
	let abv = '';
	let result;

	const options = [
		{ value: 'volume', label: 'Volume' },
		{ value: 'weight', label: 'Weight' }
	];

	function weightResult() {
		let result = (((Number(weight) / Number(sg)) * Number(abv)) / 1000).toFixed(2);
		return result;
	}
	function volumeResult() {
		let result = ((Number(volume) * Number(abv)) / 1000).toFixed(2);
		return result;
	}

	function toggleView() {
		viewCalc = !viewCalc;
	}
	function calcUnits() {
		if (selectedOption === 'weight') {
			result = ((Number(weight) / Number(sg)) * Number(abv)) / 1000;
		} else {
			result = (Number(volume) * Number(abv)) / 1000;
		}
	}
</script>

<div class="outer">
	<div class="wrapper">
		<!-- <h1 class="card drawn1">Alcohol Units Calculator</h1> -->
		<h1 class="card drawn1">U.K.Units Alcohol Calculator</h1>
		<button onclick={toggleView}>
			{#if viewCalc}<span class="bigly">&larr;</span>
				Show Explanation
			{:else}Go to Calculator <span class="bigly">&rarr;</span>
			{/if}
		</button>
		<div class:hide={viewCalc} class:show={!viewCalc}><Explanation /></div>
		<div class:show={viewCalc} class:hide={!viewCalc}></div>
		{#if viewCalc}
			<div class="card drawn1 calc">
				<div class="radioGroup">
					<h4>Are you starting with a volume or a weight?</h4>
					{#each options as option}
						<label class="radio">
							<input
								type="radio"
								name="radioGroup"
								bind:group={selectedOption}
								value={option.value}
								checked={selectedOption === option.value}
								style="vertical-align: top"
							/>
							{option.label}
						</label>
					{/each}
				</div>
				<section class="form">
					{#if selectedOption === 'weight'}
						<div class="label">
							Weight, <strong>W</strong>
						</div>
						<div class="input">
							<input type="number" id="weight" bind:value={weight} />
							<span>g</span>
						</div>
						<div class="label">
							Specific Gravity, <strong>SG</strong>
						</div>
						<div class="input">
							<input type="number" id="sg" bind:value={sg} size="10" />
						</div>
					{:else}
						<div class="label">
							Volume, <strong>V</strong>
						</div>
						<div class="input">
							<input type="number" id="volume" bind:value={volume} size="10" />
							<span>ml</span>
						</div>
					{/if}

					<div class="label">
						Alcohol by volume, <strong>ABV</strong>
					</div>

					<div class="input">
						<input type="number" id="abv" bind:value={abv} size="10" />
						<span>%</span>
					</div>
				</section>

				{#if selectedOption === 'weight'}
					<div class="formulabox">
						Weight (g) &divide; SG &times; ABV (%) &divide; 1000 = UK Units
					</div>
					<div class="resultbox">
						{#if weight && sg && abv}
							{weight} &divide; {sg} &times; {abv} &divide; 1000 &equals;
							<span class="result">{weightResult()}</span>
							UK Units
						{/if}
					</div>
				{:else}
					<div class="formulabox">Volume (ml) &times; ABV (%) &divide; 1000 = UK Units</div>
					<div class="resultbox">
						{#if volume && abv}
							{volume} &times; {abv} &divide; 1000 &equals;
							<span class="result">{volumeResult()}</span>
							UK Units
						{/if}
					</div>
				{/if}
			</div>

			{#if selectedOption === 'weight'}
				<h3 class="sg">Click below for a list of specific gravities</h3>
				<div class="poison"><SGs /></div>
			{/if}
		{/if}
	</div>
</div>

<!-- </div> -->

<style>
	/* .poison {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	} */
	.result {
		color: white;
		background: #a00;
		border-radius: var(--radius-2);
		font-size: 1.5rem;
		padding-inline: 1rem;
		padding-block: 0.5rem;
	}
	.resultbox {
		height: 2rem;
		margin-block: 1rem;
		font-family: inherit;
		font-size: 1.25rem;
		font-style: italic;
		font-weight: bold;
	}
	.formulabox {
		margin-block: 2rem;
		font-family: inherit;
		font-style: italic;
	}
	.show {
		display: block;
	}
	.hide {
		display: none;
	}
	section.form {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		row-gap: 0.5rem;
		column-gap: 1rem;
	}
	.form .input {
		justify-self: start;
		align-self: center;
	}
	.form .label {
		justify-self: end;
		align-self: center;
	}
	.outer {
		background-color: var(--sand-2);
		margin: 0;
		padding: 1rem;
		min-height: 100vh;
	}
	.wrapper {
		display: flex;
		justify-content: start;
		align-items: center;
		flex-direction: column;
		margin-inline: auto;
		text-align: center;
		max-width: 1024px;
		padding: var(--size-3);
		max-width: 50rem;
		font-size: var(--font-size-fluid-0);
	}

	.wrapper h1 {
		color: #a00;
		font-family: 'Valittey', cursive;
		font-size: var(--font-size-6);
		font-weight: semibold;
		letter-spacing: 0.25rem;
		padding-inline: 2rem;
		margin: 0;
		word-spacing: -1.25rem;
	}
	h3 {
		font-size: 1rem;
		margin-block-start: 2rem;
		margin-block-end: 0.5rem;
		font-family: 'Alkes', sans-serif;
		font-style: italic;
	}
	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
		border: var(--border-size-3) solid #a00;
		box-shadow: var(--shadow-6);
		margin: 1rem;
		padding: 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
	}

	button {
		background: #a00;
		border: var(--border-size-3) solid #a00;
		border-radius: var(--radius-drawn-1);
		box-shadow: var(--shadow-6);
		color: white;
		font-size: var(--font-size-2);
		letter-spacing: 0.035rem;
		margin: 1rem;
		padding: 0 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
	}
	button:hover {
		background: #800;
		border: var(--border-size-3) solid #800;
	}
	.bigly {
		font-size: 1.5rem;
		font-weight: bold;
	}
	.drawn1 {
		border-radius: var(--radius-drawn-1);
	}

	input[type='radio'] {
		appearance: none;
		background-color: var(--sand-1);
		margin: 0;
		font: inherit;
		color: currentColor;
		width: 1.15em;
		height: 1.15em;
		border: 0.09em solid currentColor;
		border-radius: 50%;
		transform: translateY(1.25em) translateX(-1.25em);
		display: grid;
		place-content: center;
	}

	input[type='radio']::before {
		content: '';
		width: 0.65em;
		height: 0.65em;
		border-radius: 50%;
		transform: scale(0);
		transition: 120ms transform ease-in-out;
		box-shadow: inset 1em 1em #900;
	}

	input[type='radio']:checked::before {
		transform: scale(1);
	}

	label.radio {
		display: inline-block;
		margin-block-end: 4rem;
		margin-inline: 2rem;
	}

	input[type='number'] {
		width: 7rem;
		background-color: var(--sand-1);
		border: 0.09em solid black;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}
	h4 {
		margin-block-end: 1rem;
	}

	@media (max-width: 600px) {
		.outer {
			padding: 0.75rem;
			padding-inline: 0;
		}
		.wrapper {
			padding: var(--size-1);
		}
		.wrapper h1 {
			font-size: var(--font-size-5);
			letter-spacing: 0.45rem;
		}
		button {
			background: #a00;
			border: var(--border-size-3) solid #a00;
			border-radius: 0;
		}

		.card {
			border-radius: 0.375rem;
			border: 2px solid #a00;
			font-size: 150%;
			margin-inline: auto;
			margin-block-start: 0;
			width: 95%;
			min-width: 0;
			padding-inline: 0.5rem;
		}
		.calc {
			margin-inline: auto;
		}
		.resultbox {
			font-size: 120%;
		}
		.result {
			font-size: 1.25rem;
			padding: 0.5rem;
			padding-block: 0.25rem;
		}
		.sg {
			font-size: 90%;
		}
		.poison {
			font-size: 70%;
		}
	}
</style>
