<div class="container pt-4">
	<p>
		If you've made it this far, you're probably familiar with the semi-addictive word game <strong
			>Wordle</strong
		>. (If not, just DuckDuckGo the term "Wordle" and prepare for a life-changing experience). So
		I'm going to assume that you're familiar with the game, and that you're here to learn how to use
		this <strong>Wordle8r</strong> tool.
	</p>
	<p>
		Start Wordle as you normally would. Make your first guess. Then, when you get feedback, enter
		the same guess into Wordle8r and the feedback (colours) that you received from Wordle. Wordle8r
		will then generate a list of possible words that could be the solution word. You can then use
		this list to help you make your next guess. Should you need help... Repeat as necessary. Easy
		peasy.
	</p>

	<p>
		Of course, this may be considered cheating by some! And, yes, it is a good mental and vocabulary
		exercise to solve the puzzle without any help. But, if you're stuck, or if you're just curious,
		this tool is here to help. (I don't generally use it myself; it was more of a fun programming
		exercise. But I do use it after the fact to see what I missed.)
	</p>
	<p>
		Wordle uses two word lists. The first is a list of all five letter words, as determined (I
		think) by the Scrabble word dictionary. Many of these more than twelve thousand words are quite
		obscure: abmho, becke, caple, dashi, ... But they are all legal and Wordle will accept them for
		a guess.
	</p>
	<p>
		It won't use these obscure words for a solution, though. The second list, of around 2,300
		'common' words, are used to choose the word of the day, in random order. Or that was how the
		original version of Josh Wardle's game was designed; now that it is owned by the New York Times,
		the original solution set has changed a little. For example, the word "squid" was the solution
		recently despite never being one of the 2,300 or so solutions.
	</p>
	<p>
		When you look at the list of possible words for the current state of your guesses, you may
		notice some in bold font. These represent the words originally in the solutions list. For the
		most part, it still represents the set of possible solutions. "squid" and an unknown number of
		other words notwithstanding.
	</p>
	<p><a href="/misc/w8r/"><strong>Let's Play</strong> </a></p>
</div>

<style>
	.container {
		max-width: min(100vw, 40rem);
		display: flex;
		flex-direction: column;
		font-size: 100%;
		gap: 1rem;
		margin-inline: auto;
		overflow-y: auto;
		padding-block-end: 14rem;
	}
	a {
		display: flex;
		justify-content: center;
		color: inherit;
		text-decoration: underline;
	}
</style>
