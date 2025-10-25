class

class Region:
	def __init()

class PipsBoard:
	def __init__(w, h):
		self.width = w
		self.height = h
		self.open = []

	def set_open(mat):
		for i in mat:
			for j in mat:
				j = bool(j)
		self.open = mat

	def add_region(region):


easy = PipsBoard(4, 4)
easy.set_open([
	[0,1,0,0],
	[1,1,1,1],
	[1,0,1,1],
	[1,1,1,1],
])
