import sys
import ast
import re

with open("../words_alpha.txt", "r") as wa:
	words = list(map(lambda x: x.strip(), wa.readlines()))

def build_t(words):
	t = {}
	for word in words:
		node = t
		for char in word:
			node = node.setdefault(char, {})
		node['#'] = True
	return t

def find_words(grid, words):
	rows, cols = len(grid), len(grid[0])
	t = build_t(words)
	found = set()
	
	def dfs(r, c, node, path, ids, visited):
		if '#' in node:
			found.add((path, tuple(ids)))
		for dr in [-1, 0, 1]:
			for dc in [-1, 0, 1]:
				if dr == dc == 0:
					continue
				nr, nc = r + dr, c + dc
				if 0 <= nr < rows - 1 and 0 <= nc < cols - 1 and (nr, nc) not in visited:
					letter = grid[nr][nc]['letter']
					if letter in node:
						dfs(nr, nc, node[letter], path + letter, ids + (grid[nr][nc]['id'],), visited | {(nr,nc)})

	for i in range(rows - 1):
		for j in range(cols - 1):
			letter = grid[i][j]['letter']
			id = grid[i][j]['id']
			if letter in t:
				dfs(i, j, t[letter], letter, (id,), {(i, j)})

	filtered = list(filter(lambda i: len(i[1]) >= 4, found))[:100]
	return filtered

test_input = ast.literal_eval(sys.argv[1])
print(find_words(test_input, words))