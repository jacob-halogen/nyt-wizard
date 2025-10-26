import re
import sys
import ast

with open("../words_alpha.txt", "r") as wa:
	words = list(map(lambda x: x.strip(), wa.readlines()))
	
test_input =  {"letters": ["l", "a", "e", "k", "t", "o"], "center": "f"}

def filter_words(data):
	letters = data["letters"]
	center_letter = data["center"]
	letters.append(center_letter)
	regex = rf"^[{"".join(letters)}]*{center_letter}[{"".join(letters)}]*$"
	pattern = re.compile(regex)
	filtered = list(filter(lambda s: pattern.search(s), words))
	filtered = list(filter(lambda i: len(i) >= 4, filtered))
	ordered = sorted(filtered, key=len, reverse=False)
	return ordered

test_input = ast.literal_eval(sys.argv[1])
test = filter_words(test_input)
print(test)
