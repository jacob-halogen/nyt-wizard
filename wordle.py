import re
import ast
import random
import sys

with open("../wordle-guesses.txt", "r") as gf, open("../wordle-answers.txt", "r") as af:
	guesses = list(map(lambda x: x[0:5], gf.readlines()))
	answers = list(map(lambda x: x[0:5], af.readlines()))

test_input = [[["a","present"],["u","absent"],["d","present"],["i","absent"],["o","absent"]],[["t","absent"],["e","absent"],["s","absent"],["t","absent"],["s","absent"]],[["s","absent"],["p","absent"],["a","present"],["d","correct"],["e","absent"]],[],[],[]]

def read_input(data):
	absent_chars = set()
	present_chars = [set() for i in range(5)]
	correct_chars = ["" for i in range(5)]

	for word in data:
		for i, [letter, state] in enumerate(word):
			if state == "absent":
				absent_chars.add(letter)
			elif state == "present":
				present_chars[i].add(letter)
			elif state == "correct":
				correct_chars[i] = letter

	return set(absent_chars), present_chars, correct_chars

def filter_dictionary(absent, present, correct, dictionary):
	correct_regex = r"" \
	+ ("[a-z]" if correct[0] == "" else correct[0]) \
	+ ("[a-z]" if correct[1] == "" else correct[1]) \
	+ ("[a-z]" if correct[2] == "" else correct[2]) \
	+ ("[a-z]" if correct[3] == "" else correct[3]) \
	+ ("[a-z]" if correct[4] == "" else correct[4])
	correct_pattern = re.compile(correct_regex)
	filter_correct = list(filter(lambda s: correct_pattern.search(s), dictionary))

	must_haves = set(letter for position in present for letter in position)
	must_haves_text = "".join(f"(?=.*{letter})" for letter in must_haves)
	not_theres = "".join(f"[^{''.join(position)}]" if position else "." for position in present)

	present_regex = rf"{must_haves_text}{not_theres}"
	present_pattern = re.compile(present_regex)
	filter_present = list(filter(lambda s: present_pattern.search(s), filter_correct))

	absent_regex = (f"[^{"".join(absent)}]" if len(absent) > 0 else "") * 5
	absent_pattern = re.compile(absent_regex)
	filter_absent = list(filter(lambda s: absent_pattern.search(s), filter_present))

	return filter_absent

def calculate_best_word(filtered_words, present):
	occurances = {}

	for word in filtered_words:
		for letter in word:
			if occurances.__contains__(letter):
				occurances[letter].append(word)
			else:
				occurances[letter] = [word]
			
	for position in present:
		for letter in position:
			if occurances.__contains__(letter):
				occurances.pop(letter)

	most_common_letter = max(occurances, key=lambda x: len(set(occurances[x])))
	words_remaining = occurances[most_common_letter]
	occurances.pop(most_common_letter)
	while len(words_remaining) > 1:
		most_common_letter = max(occurances, key=lambda x: len(set(occurances[x])))
		if len(list(set(words_remaining) & set(occurances[most_common_letter]))) < 1:
			break
		words_remaining = list(set(words_remaining) & set(occurances[most_common_letter]))
		occurances.pop(most_common_letter)

	return words_remaining[random.randint(0, len(words_remaining) - 1)]

test_input = ast.literal_eval(sys.argv[1])
absent, present, correct = read_input(test_input)
filtered_guesses = filter_dictionary(absent, present, correct, guesses)
best_word = calculate_best_word(filtered_guesses, present)
print(best_word)