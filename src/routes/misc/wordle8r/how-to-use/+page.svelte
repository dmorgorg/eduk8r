<div class="container pt-4">
	<p>
		If you've made it this far, you're probably familiar with the semi-addictive word game Wordle.
		(If not, just DuckDuckGo the term "Wordle" and prepare for a life-changing experience). I'm
		going to assume that you're familiar with the game, and that you're here to learn how to use
		this tool.
	</p>
	<p>
		To use the tool, simply enter the feedback (colours) you received from your Wordle guess into
		the boxes provided. The tool will then generate a list of possible words that could be the
		solution word. You can then use this list to help you make your next guess. Should you need
		help...
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
		'common' words, are used to choose the word of the day. Supposedly randomly. Or that was how the
		original version of the game was designed. Now that it is owned by the New York Times, the
		solution may be occasionally curated.
	</p>
</div>

<style>
	.container {
		max-width: min(100vw, 30rem, 50rem);
		display: flex;
		flex-direction: column;
		font-size: 100%;
		gap: 2rem;
		margin-inline: auto;
	}
</style>
