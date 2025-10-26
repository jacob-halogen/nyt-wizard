def solve_sodoku(grid_str):
    grid = []
    for i in range(9):
        row = []
        for j in range(9):
            val = int(grid_str[i][j]) if grid_str[i][j] else 0
            row.append(val)
        grid.append(row)

    if not solve(grid):
        print("No solution found.")
    print(grid)
    
    return grid


def solve(grid):
    find = find_empty_cell(grid)
    if not find:
        return True
    row, column = find

    for number in range(1, 10):
        if is_valid_placement(grid, number, (row, column)):
            grid[row][column] = number
            if solve(grid):
                return True
            grid[row][column] = 0 
    return False

def find_empty_cell(grid):
    for r in range(9):
        for c in range(9):
            if grid[r][c] == 0:
                return (r, c)
    return None

def is_valid_placement(grid, number, position):
    row, column = position

    if number in grid[row]:
        return False

    for r in range(9):
        if grid[r][column] == number:
            return False

    box_start_row = (row // 3) * 3
    box_start_column = (column // 3) * 3

    for r in range(box_start_row, box_start_row + 3):
        for c in range(box_start_column, box_start_column + 3):
            if grid[r][c] == number:
                return False

    return True

puzzle_input_strings = ['your mom']

solve_sodoku(puzzle_input_strings)