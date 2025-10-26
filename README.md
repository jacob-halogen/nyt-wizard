# NYT Wizard

The NYT Wizard shall solve any of the New York Times games (except the ones that it can't).

- [x] Spelling Bee (easy)
- [x] Wordle (medium)
- [x] Pips (hard)
- [ ] Strands (medium)
- [ ] Connections (medium)
- [ ] Letter Boxed (who?)
- [ ] Tiles (medium)
- [x] Sudoku (easy)

## Spelling Bee

This is probably the easiest one, it finds all the words containing the right letters and types them for you, starting with the longest words.

## Wordle

It narrows down the possible words given the colours we've been shown, then picks its favourite by some heuristic. We would've made this smarter if we understood information theory.

## Pips

This one is very hard. Our solution is incredibly slow so only really works on easy puzzles, but it makes use of a tree search with pruning, similar to a chess bot. We wrote it in Rust because it demanded a language of grace and elegance. Oddly, the hardest part of the problem was automatically dragging the dominos to their place on the board.

## Strands

We're kinda cheating by using hints.

## Sudoku

This isn't much harder than Spelling Bee frankly. It's just a cheeky bit of recursion to please the Efficiency Gods. Written in Python for simplicity and convenience, maybe I should've done it in ANSI C for a first year throwback.  
