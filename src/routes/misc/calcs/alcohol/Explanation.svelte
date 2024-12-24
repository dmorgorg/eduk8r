<div class="card drawn2">
	<p>
		So, you are interested in calculating your alcohol consumption, in UK alcohol units, where one
		alcohol unit is defined by the National Health Service (NHS) to be equal to 10 ml (millilitres)
		or 7.89 g (grams) of pure alcohol. It's not a difficult calculation, if you know the volume of
		the drink in millilitres (V ml) and the percentage of alcohol by volume (ABV%). Then:
	</p>
	<p>
		<strong>Alcohol Units = V &times; ABV &divide; 1000</strong>
		<br />
		(where V is in millilitres and ABV is a percentage)
	</p>
	<p>
		For example, consider 1 pint of 5% ABV beer in an English pub. UK pints are 586 ml. <br />
		(US pints are smaller, at 473 ml.)
	</p>
	<p>
		<strong>Then:</strong>
		586 &times 5 &divide; 1000 = 2.93 alcohol units
	</p>
</div>
<div class=" card drawn3">
	<p>
		That's pretty straightforward. But how to calculate the volume if you pour yourself a glass of
		wine, or of Scotch, at home? You may have a measuring cup, or jug, in the kitchen but they are
		not so accurate for small measurements in millilitres &ndash; and drinking a fine single malt
		out of a measuring cup does seem like sacrilege. If you have a digital kitchen scale, you can <strong
		>
			weigh
		</strong>
		the drink &ndash; and then convert the weight to volume, using the specific gravity of the drink.
	</p>
	<p><strong>From Weight to Volume</strong></p>
	<p>
		Due to the magic of the metric system, 1 g of water (at 4&deg;C) has a volume of 1 ml. At room
		temperature, the volume to only 1.002 ml so we can safely stay with the 1:1 ratio.
	</p>
	<p>
		The specific gravity of <strong>wine</strong>
		is usually within 1% of that of water (i.e., it has pretty much the same density as water). So, 100&nbsp;g
		of wine has a volume very close to 100&nbsp;ml.
	</p>
	<p>
		The specific gravity of <strong>beer</strong>
		is not as close to 1 as is wine, usually in the range of 1.010 to 1.020. So, 100 g of beer has a
		volume of 98 to 99 ml.
	</p>
	<p>
		Beer is usually sold by volume from taps in bars or restaurants, or by the bottle with the
		volume stated on the label. A conversion to volume is not usually required. But, if you brew
		your own beer, you may need to weigh it. (And, if you are home-brewing, you may own a hydrometer
		and be able to measure its specific gravity quite accurately.)
	</p>
	<p>
		<strong>Spirits,</strong>
		with their high alcohol content, have specific gravities in the range of 0.940 to 0.980. So using
		the 1&nbsp;g&nbsp;=&nbsp;1&nbsp;ml can add up the 6% error in the volume which might be significant
		if you're considering whether another drink might put you over your weekly allowance.
	</p>
	<p>Now, the calculation is as follows:</p>
	<p>
		<strong>UK Alcohol Units = W &divide; SG &times; ABV &divide; 1000</strong>
		<br />
		where W is the weight of the drink in grams and SG is its specific gravity
		<br />
		(so that W &divide; SG is the volume in millilitres)
	</p>
	<p>For example, consider 50 g of fine Scotch whisky:</p>
	<p>
		<strong>Then:</strong>
		50 &divide; 0.95 &times 40 &divide; 1000 = 2.11 UK alcohol units
	</p>
</div>

<style>
	.card {
		background: white;
		border: var(--border-size-3) solid #a00;

		margin: 1rem;
		padding: 1rem;
		font-family: 'AlkesRgIt', sans-serif;
		font-size: var(--font-size-3);
		font-style: italic;
		box-shadow: var(--shadow-6);
	}
	/* .drawn1 {
		border-radius: var(--radius-drawn-1);
	} */
	/* .drawn2 {
		border-radius: var(--radius-drawn-2);
	}
	.drawn3 {
		border-radius: var(--radius-drawn-3);
	} */

	@media (max-width: 600px) {
		.card {
			border-radius: 0.375rem;
			border: 2px solid #a00;
			font-size: 125%;
			margin-inline: auto;
			margin-block-start: 0;
			width: 95%;
			min-width: 0;
			max-width: 100%;
			/* background: yellow; */
			padding-inline: 0.5rem;
		}
	}
</style>
