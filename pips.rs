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
                if coords.contains(&(i, j)) {
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            mask.push(row);
        }
        BoardMask {tiles: mask}
    }

    fn print(&self) {
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
    tiles: BoardMask,
}

impl Region {
    fn print(&self) {
        println!("{:?}", self.cond);
        self.tiles.print();
    }
}

struct PipsBoard {
    width: usize,
    height: usize,
    closed: BoardMask,
    regions: Vec<Region>,
}

type Domino = (u8, u8);

fn main() {
    let easy = PipsBoard {
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
                tiles: BoardMask::from_coords(4, 4, vec![
                    (1,0),
                    (0,1),
                    (1,1),
                ])
            },
            Region {
                cond: Cond::Sum(11),
                tiles: BoardMask::from_coords(4, 4, vec![
                    (0,2),
                    (0,3),
                ])
            },
            Region {
                cond: Cond::Lt(8),
                tiles: BoardMask::from_coords(4, 4, vec![
                    (2,1),
                    (2,2),
                    (3,1),
                    (3,2),
                ])
            },
            Region {
                cond: Cond::Sum(10),
                tiles: BoardMask::from_coords(4, 4, vec![
                    (2,3),
                    (4,3),
                ])
            },
        ]
    };

    easy.closed.print();
    easy.regions[0].print();
}
