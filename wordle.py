#!/usr/bin/env python3

with open("wordle-guesses.txt", "r") as gf, open("wordle-answers.txt", "r") as af:
	guesses = list(map(lambda x: x[0:5], gf.readlines()))
	answers = list(map(lambda x: x[0:5], af.readlines()))

# colour = grey | yellow | green
# colouring = [(char, colour)]

test_colouring = [
	("p", "grey"),
	("l", "grey"),
	("a", "yellow"),
	("g", "green"),
	("e", "green"),
]



def filter_by_colouring(words, colouring):
	grey_chars = []
	yellow_chars = []
	green_chars = []
	output = []

	#words = words[0:20]

	for i, (char, colour) in enumerate(colouring):
		if colour == "grey":
			grey_chars += char
		elif colour == "green":
			green_chars.append((i, char))
		elif colour == "yellow":
			yellow_chars.append((i, char))

	# filter out grey chars
	for gc in grey_chars:
		for w in words:
			if gc in w:
				#words.remove(w)
				pass
		#words = filter(lambda w: (gc not in w), words)

	# filter out chars in wrong place
	for yc in yellow_chars:
		#words = list(filter(lambda w: yc not in enumerate(w), words))
		pass

	# filter for green chars in right place
	for gc in green_chars:
		print(gc)
		for w in words:
			if gc not in enumerate(w):
				words.remove(w)
				print("AA")
		#words = filter(lambda w: gc in enumerate(w), words)

	print("grey:  ", grey_chars)
	print("yellow:", yellow_chars)
	print("green: ", green_chars)
	words = list(words)
	print(words[0:20])
	print(len(words), "words")
