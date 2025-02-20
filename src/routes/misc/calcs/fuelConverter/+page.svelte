<script>
	/**
	 * @type {any}
	 */
	let mpgImp = $state();
	/**
	 * @type {any}
	 */
	let mpgUS = $state();
	/**
	 * @type {any}
	 */
	let kpl = $state();
	/**
	 * @type {any}
	 */
	let lp100k = $state();

	function reset() {
		mpgImp = '';
		mpgUS = '';
		kpl = '';
		lp100k = '';
	}
	function mpgImpChange() {
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		kpl = ((mpgImp * 1.609344) / 4.54609).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function mpgUSChange() {
		mpgImp = (mpgUS * 1.20095).toFixed(2);
		kpl = ((mpgUS * 1.20095 * 1.609344) / 4.54609).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function kplChange() {
		mpgImp = ((kpl / 1.609344) * 4.54609).toFixed(2);
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		lp100k = (100 / kpl).toFixed(2);
	}
	function lp100kChange() {
		kpl = (100 / lp100k).toFixed(2);
		mpgImp = ((100 / lp100k / 1.609344) * 4.54609).toFixed(2);
		mpgUS = (mpgImp / 1.20095).toFixed(2);
		// lp100k = lp100k.toFixed(2)
	}
</script>

<div class="outer">
	<div class="wrapper">
		<h1 class="card">Metric/Imperial Fuel Converter</h1>

		<div class="card">
			<section class="form">
				<div class="label">Miles per Imperial gallon</div>
				<div class="input">
					<input type="number" id="mpgImp" onkeyup={mpgImpChange} bind:value={mpgImp} />
					<span>mpg</span>
				</div>

				<div class="label">Miles per US gallon</div>
				<div class="input">
					<input type="number" id="mpgUS" onkeyup={mpgUSChange} bind:value={mpgUS} />
					<span>mpg</span>
				</div>

				<div class="label">Kilometres per litre</div>
				<div class="input">
					<input type="number" id="kpl" onkeyup={kplChange} bind:value={kpl} />
					<span>km/l</span>
				</div>

				<div class="label">Litres per 100 kilometres</div>
				<div class="input">
					<input type="number" id="lp100k" onkeyup={lp100kChange} bind:value={lp100k} />
					<span>l/100km</span>
				</div>
			</section>
		</div>
		<button onclick={reset}>Clear</button>
	</div>
</div>

<style>
	section.form {
		display: grid;
		grid-template-columns: 1.25fr 1fr;
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
	.form input {
		font-size: 1.5rem;
		font-style: italic;
	}

	.wrapper h1.card {
		background-color: inherit;
		border: none;
		box-shadow: none;
		color: black;
		font-family: 'Kaushan', cursive;
		font-size: var(--font-size-7);
		font-weight: bold;
		letter-spacing: 0.125rem;
		padding-inline: 2rem;
		margin: 0;
		text-align: center;
		-webkit-text-stroke: black 0.5px;
		word-spacing: 0;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
		border: var(--border-size-3) solid black;
		border-radius: var(--radius-3);
		box-shadow: var(--shadow-6);
		margin: 1rem;
		padding: 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
	}

	button {
		justify-self: flex-end;
		background: white;
		border: var(--border-size-3) solid black;
		border-radius: 0.75rem;
		color: black;
		font-size: var(--font-size-2);
		font-weight: semibold;
		letter-spacing: 0.035rem;
		margin: 1rem;
		padding: 0 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
	}
	button:hover {
		background: black;
		/* background-color: black; */

		color: white;
		text-align: right;
	}

	input[type='number'] {
		width: 5rem;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}

	.outer {
		background: #ddd;
		margin: 0;
		padding: 1rem;
		min-height: 100vh;

		.wrapper {
			display: flex;
			justify-content: start;
			align-items: center;
			flex-direction: column;
			margin-inline: auto;
			/* text-align: center; */
			/* max-width: 1024px; */
			padding: var(--size-3);
			/* max-width: 50rem; */
		}
	}

	@media (max-width: 600px) {
		.outer {
			padding: 0.5rem;
			padding-inline: 0;
		}
		.wrapper {
			padding: var(--size-1);
		}
		.wrapper h1 {
			/* border: var(--border-size-2) solid #a00; */
			/* font-family: 'Katherine Script', sans-serif; */
			font-size: var(--font-size-1);
		}

		button {
			font-size: 100%;
			padding: 0 0.5rem 0.35rem 0.5rem;
			margin-block-start: 1rem;
		}
		.card {
			border-width: var(--border-size-2);
			font-size: 100%;
			margin-inline: auto;
			margin-block-start: 0;
			min-width: 0;
			padding-inline: 0.5rem;
		}
	}
</style>
