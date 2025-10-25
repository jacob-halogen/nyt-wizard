struct BoardMask {
    tiles: Vec<Vec<u8>>,
}

impl BoardMask {
    fn from_matrix(mat: Vec<Vec<u8>>) -> BoardMask {
        BoardMask {tiles: mat}
    }

    fn from_coords(width: usize, height: usize, coords: Vec<(usize, usize)>) -> BoardMask {
        let mut mask = vec![];
        for i in 0..height {
            let mut row = vec![];
            for j in 0..width {
                if coords.contains(&(j, i)) {
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            mask.push(row);
        }
        BoardMask {tiles: mask}
    }

    fn empty(width: usize, height: usize) -> BoardMask{
        BoardMask::from_coords(width, height, vec![])
    }

    fn get_coord(&self, x: usize, y: usize) -> u8 {
        self.tiles[y][x]
    }

    fn set_coord(&mut self, x: usize, y: usize, num: u8) {
        self.tiles[y][x] = num;
    }

    fn print_bool(&self) {
        for row in self.tiles.iter() {
            for cell in row.iter() {
                print!("{}", match cell {
                    0 => " .",
                    _ => " █",
                });
            }
            print!("\n");
        }

    }

    fn print_nums(&self) {
        for row in self.tiles.iter() {
            for cell in row.iter() {
                print!(" {}", cell);
            }
            print!("\n");
        }
    }
}

#[derive(Debug)]
enum Cond {
    Eq,
    Ne,
    Lt(u8),
    Gt(u8),
    Sum(u8)
}

struct Region {
    cond: Cond,
    mask: BoardMask,
}

impl Region {
    fn print(&self) {
        println!("{:?}", self.cond);
        /*println!("{}{}", match self.cond {
            Cond::Eq => "=",
            Cond::Ne => "≠",
            Cond::Lt(_) => "<"
            Cond::Gt(_) => ">"
            Cond::Sum(_) => ""
        });*/
        self.mask.print_bool();
    }
}

struct PipsBoard {
    width: usize,
    height: usize,
    closed: BoardMask,
    regions: Vec<Region>,
}

type Domino = (u8, u8);

struct Move {
    a: u8,
    ax: usize,
    ay: usize,
    b: u8,
    bx: usize,
    by: usize,
}

struct PipsState {
    board: PipsBoard,
    placed_nums: BoardMask, // 0-6 for actual nums and 7 for empty (yes i know its bad)
    free_dominos: Vec<Domino>,
    fringe: BoardMask,
}

impl PipsState {

    fn print(&self) {
        self.board.closed.print_bool();
        self.placed_nums.print_nums();
        for i in self.board.regions.iter() {
            i.print();
        }
    }

    fn expand_fringe(&mut self, x: usize, y: usize) {
        let neighbors = vec![
            (x-1, y),
            (x+1, y),
            (x, y-1),
            (x, y+1),
        ];
        for (x,y) in neighbors {
            if self.placed_nums.get_coord(x, y) == 7 {
                self.fringe.set_coord(x,y, 1);
            }
        }
    }

    fn retract_fringe(&mut self, x: usize, y: usize) {
        fn neighbors(i: usize, j: usize) -> Vec<(usize, usize)> {
            vec![
                (i-1, j),
                (i+1, j),
                (i, j-1),
                (i, j+1),
            ]
        }
        for (a,b) in neighbors(x,y) {
            if self.fringe.get_coord(a, b) == 1 {
                let mut valid_fringe = false;
                for (c,d) in neighbors(a,b) {
                    if self.placed_nums.get_coord(a, b) != 7 {
                        valid_fringe = true;
                    }
                }
                if !valid_fringe {
                    self.fringe.set_coord(a,b, 0);
                }
            }
        }
    }

    fn do_move(&mut self, m: Move) {
        if self.placed_nums.get_coord(m.ax, m.ay) == 7
        && self.placed_nums.get_coord(m.bx, m.by) == 7 {
            self.placed_nums.set_coord(m.ax, m.ay, m.a);
            self.placed_nums.set_coord(m.bx, m.by, m.b);
        } else {
            panic!["domino placed on top of domino"];
        }
    }

    fn undo_move(&mut self, m: Move) {
        self.placed_nums.set_coord(m.ax, m.ay, 7);
        self.placed_nums.set_coord(m.bx, m.by, 7);
    }

    fn get_moves(&self) {
        let moves: Vec<Move> = vec![];
        for i in self.free_dominos.iter() {

        }
    }
}

fn main() {
    let mut easy = PipsState {
        board: PipsBoard {
            width: 4,
            height: 4,
            closed: BoardMask::from_matrix(vec![
                vec![1,0,1,1],
                vec![0,0,0,0],
                vec![0,1,0,0],
                vec![0,0,0,0],
            ]),
            regions: vec![
                Region {
                    cond: Cond::Eq,
                    mask: BoardMask::from_coords(4, 4, vec![
                        (1,0),
                        (0,1),
                        (1,1),
                    ])
                },
                Region {
                    cond: Cond::Sum(11),
                    mask: BoardMask::from_coords(4, 4, vec![
                        (0,2),
                        (0,3),
                    ])
                },
                Region {
                    cond: Cond::Lt(8),
                    mask: BoardMask::from_coords(4, 4, vec![
                        (2,1),
                        (2,2),
                        (3,1),
                        (3,2),
                    ])
                },
                Region {
                    cond: Cond::Sum(10),
                    mask: BoardMask::from_coords(4, 4, vec![
                        (2,3),
                        (3,3),
                    ])
                },
            ]
        },
        placed_nums: BoardMask::empty(4,4),
        free_dominos: vec![
            (0, 0),
            (1, 2),
            (2, 6),
            (5, 5),
            (5, 6),
            (5, 0),
        ],
        fringe: BoardMask::empty(4,4),
    };

    easy.print();
}
