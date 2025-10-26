# NYT Wizard

The NYT Wizard shall solve any of the New York Times games (except the ones that it can't). Gaze upon Harvey's glorious naming conventions in `nyt-wizard-extension.js`.

- [x] Spelling Bee (easy)
- [x] Wordle (medium)
- [x] Pips (hard)
- [ ] Strands (medium) <- partially complete
- [ ] Connections (medium)
- [ ] Letter Boxed (who?)
- [x] Tiles (easy)
- [x] Sudoku (easy)

## Spelling Bee

This is probably the easiest one, it finds all the words containing the right letters and types them for you, starting with the longest words.

## Wordle

It narrows down the possible words given the colours we've been shown, then picks its favourite by some heuristic. We would've made this smarter if we understood information theory.

## Pips

This one is very hard. Our solution is incredibly slow so only really works on easy puzzles, and doesn't link with the front-end, but it makes use of a tree search with pruning, similar to a chess bot. I promise it's beautiful on the inside, I wrote it in Rust because it demanded a language of grace and elegance. Oddly, the hardest part of the problem was automatically dragging the dominos to their place on the board.

## Strands

It half works. We're kinda cheating by using hints, and we ran out of time before we could do the second half.

## Connections

We didn't make a connections solver, but we certainly thought about it a lot.

## Letter Boxed

We never touched this game before the hackathon and still haven't touched it, it looks scary and hard. 

## Tiles

Tiles looks relatively neat when you press the button. The solution was very complex, it has a whopping TWO for-loops.

## Sudoku

This isn't much harder than Spelling Bee frankly. It's just a cheeky bit of recursion to please the Efficiency Gods. Written in Python for simplicity and convenience, maybe I should've done it in ANSI C for a first year throwback.  
