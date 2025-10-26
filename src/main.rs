use std::collections::HashSet;
use std::collections::HashMap;
use serde_json;
use std::fs;

const EMPTY: u8 = 255;

#[derive(Eq, PartialEq, Hash, Clone)]
struct BoardMask {
    tiles: Vec<Vec<u8>>,
}

impl BoardMask {
    fn from_json_data(width: usize, height: usize, v: serde_json::Value) -> BoardMask {
        BoardMask::from_coords(width, height, vec![])
    }

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

    fn to_coords(&self) -> Vec<(usize, usize)> {
        let mut coords = vec![];
        let height = self.tiles.len();
        let width = self.tiles[0].len();
        for row in 0..height {
            for col in 0..width {
                if self.tiles[row][col] != 0 {
                    coords.push((col, row));
                }
            }
        }
        coords
    }

    fn fill(width: usize, height: usize, num: u8) -> BoardMask{
        BoardMask {tiles: vec![vec![num; width]; height]}
    }

    fn complement(&self) -> BoardMask { // nots everything
        let mut tiles: Vec<Vec<u8>> = vec![];
        let height = self.tiles.len();
        let width = self.tiles[0].len();
        for row in 0..height {
            tiles.push(vec![]);
            for col in 0..width {
                if self.tiles[row][col] == 0 {
                    tiles[row].push(1);
                } else {
                    tiles[row].push(0);
                }
            }
        }
        BoardMask {tiles}
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
        for i in 0..self.tiles[0].len() {
            print!("--");
        }
        print!("\n");
    }

    fn print_nums(&self) {
        for row in self.tiles.iter() {
            for cell in row.iter() {
                if cell == &EMPTY {
                    print!(" .");
                } else {
                    print!(" {}", cell);
                }
            }
            print!("\n");
        }
        for i in 0..self.tiles[0].len() {
            print!("--");
        }
        print!("\n");
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

#[derive(Debug, Clone, Hash)]
struct Move {
    a: u8,
    ax: usize,
    ay: usize,
    b: u8,
    bx: usize,
    by: usize,
}

enum MoveTree {
    Solved(bool),
    Unsolved(HashMap<Move, MoveTree>),
}

struct PipsState {
    board: PipsBoard,
    placed_nums: BoardMask, // 0-6 for actual nums and 255 for empty (yes i know its bad)
    free_dominos: Vec<Domino>,
    fringe: BoardMask,
    tried: HashSet<BoardMask>,
    nodes_searched: u64,
}

impl PipsState {

    fn solve(&mut self) -> bool {
        self.nodes_searched += 1;
        let moves = self.get_moves();
        //println!("can do moves {:?}", moves);
        //println!("{} moves", moves.len());
        for m in moves {
            //println!("choose move {:?}", m);
            self.do_move(m.clone());
            /*if self.tried.contains(&self.placed_nums) { // hashing big stuff is slow
                self.undo_move(m.clone());
            }*/
            if self.solved() {
                println!("solved");
                self.print();
                return true
            }
            if self.solve() {
                return true
            } else {
                self.undo_move(m.clone());
            }
        }
        //self.tried.insert(self.placed_nums.clone());
        return false;
    }

    fn solve2(&mut self) -> bool {
        let move_tree = MoveTree::Unsolved(HashMap::new());
        let moves:Vec<Move> = vec![];
        for m in self.get_moves() {
            // todo
        }
        false
    }

    fn print(&self) {
        println!("{:?}", self.free_dominos);
        self.board.closed.print_bool();
        self.placed_nums.print_nums();
        println!("fringe");
        self.fringe.print_bool();
        for i in self.board.regions.iter() {
            i.print();
        }
    }

    fn neighbors(&self, x: usize, y: usize) -> Vec<(usize, usize)> {
        let mut neighbors = vec![];
        if x < self.board.width - 1 {
            neighbors.push((x+1, y));
        }
        if y < self.board.height - 1 {
            neighbors.push((x, y+1));
        }
        if x > 0 {
            neighbors.push((x-1, y));
        }
        if y > 0 {
            neighbors.push((x, y-1));
        }
        neighbors
    }

    fn expand_fringe(&mut self, x: usize, y: usize) {
        for (i,j) in self.neighbors(x,y) {
            if self.placed_nums.get_coord(i,j) == EMPTY // unoccupied
            && self.board.closed.get_coord(i,j) == 0 { // and open
                self.fringe.set_coord(i,j, 1);
            }
        }
    }

    fn retract_fringe(&mut self, x: usize, y: usize) {
        for (a,b) in self.neighbors(x,y) {
            if self.fringe.get_coord(a, b) == 1 {
                let mut valid_fringe = false;
                for (c,d) in self.neighbors(a,b) {
                    if self.placed_nums.get_coord(a, b) != EMPTY {
                        valid_fringe = true;
                    }
                }
                if !valid_fringe {
                    self.fringe.set_coord(a,b, 0);
                }
            }
        }
    }

    // too much indentation, but whatever
    fn is_half_move_valid(&self, a: u8, ax: usize, ay: usize) -> bool {
        let mut valid = true;
        //println!("a {} ax {} ay {}", a, ax, ay);
        //println!("{}", self.placed_nums.get_coord(ax, ay));
        if self.placed_nums.get_coord(ax, ay) != EMPTY { // unoccupied
            return false;
        }
        if self.board.closed.get_coord(ax, ay) != 0 { // open
            return false;
        }
        for region in self.board.regions.iter() {
            let coords = region.mask.to_coords();
            if !coords.contains(&(ax, ay)) {
                continue;
            }
            let mut nums: Vec<u8> = vec![];
            for (x,y) in coords {
                nums.push(self.placed_nums.get_coord(x,y));
            }
            nums.push(a);
            let not_empty_nums: Vec<u8> = nums.clone().into_iter().filter(|x| *x != EMPTY).collect();
            if nums.len() != not_empty_nums.len() + 1 {
                return true
            }
            match region.cond {
                Cond::Eq => {
                    for num in not_empty_nums.iter() {
                        if num != &nums[0] {
                            valid = false;
                        }
                    }
                },
                Cond::Ne => {
                    if not_empty_nums.len() != not_empty_nums.iter().collect::<HashSet<_>>().len() {
                        valid = false;
                    }
                }
                Cond::Lt(x) => {
                    if not_empty_nums.iter().sum::<u8>() >= x {
                        valid = false;
                    }
                },
                Cond::Gt(x) => {
                    if not_empty_nums.iter().sum::<u8>() <= x {
                        valid = false;
                    }
                },
                Cond::Sum(x) => {
                    if not_empty_nums.iter().sum::<u8>() != x {
                        valid = false;
                    }
                }
            }
        }
        valid
    }

    fn get_moves(&self) -> Vec<Move> {
        let mut moves: Vec<Move> = vec![];
        let mut to_explore = if self.fringe.to_coords().len() == 0 {
            self.board.closed.complement().to_coords()
        } else {
            self.fringe.to_coords()
        };
        // for each domino
        for (a,b) in self.free_dominos.iter() {
            for (ax,ay) in to_explore.clone() {
                if !self.is_half_move_valid(*a, ax, ay) {
                    continue;
                }
                for (bx, by) in self.neighbors(ax, ay) {
                    if !self.is_half_move_valid(*b, bx, by) {
                        continue;
                    }
                    moves.push(Move {a:*a, ax, ay, b:*b, bx, by})
                }
            }
            // for each tile
                // a valid?
                // for each b
                    // b valid?
                        // add to move set
        }
        //println!("got moves {:?}", moves);
        moves
    }

    fn solved(&self) -> bool {
        self.free_dominos.len() == 0
    }

    fn do_move(&mut self, m: Move) {
        //println!("move {:?}", m);
        if self.placed_nums.get_coord(m.ax, m.ay) == EMPTY // if unoccupied
        && self.placed_nums.get_coord(m.bx, m.by) == EMPTY {
            self.placed_nums.set_coord(m.ax, m.ay, m.a); // place monomino
            self.expand_fringe(m.ax, m.ay); // expand fringe
            self.placed_nums.set_coord(m.bx, m.by, m.b); // same for other monomino
            self.expand_fringe(m.bx, m.by);
            self.fringe.set_coord(m.ax, m.ay, 0); // defringe occupied tiles
            self.fringe.set_coord(m.bx, m.by, 0);
            let domino_index = self.free_dominos.iter().position(|(a,b)| (*a,*b) == (m.a, m.b)).unwrap();
            self.free_dominos.remove(domino_index);
        } else {
            panic!["domino placed on top of domino"];
        }
        println!("{} searched", self.nodes_searched);
        //self.placed_nums.print_nums();
    }

    fn undo_move(&mut self, m: Move) {
        //println!("undoing");
        self.placed_nums.set_coord(m.ax, m.ay, EMPTY);
        self.placed_nums.set_coord(m.bx, m.by, EMPTY);
        self.retract_fringe(m.ax, m.ay);
        self.retract_fringe(m.bx, m.by);
        self.free_dominos.push((m.a, m.b));
    }

    fn from_json_data(vs: serde_json::Value, difficulty: &str) -> PipsState {
        let v = &vs[difficulty];
        //println!("{}", serde_json::to_string_pretty(&v).unwrap());
        let width = v["board"][1].as_number().unwrap().as_u64().unwrap() as usize;
        let height = v["board"][0].as_number().unwrap().as_u64().unwrap() as usize;
        let mut s = PipsState {
            board: PipsBoard {
                height,
                width,
                closed: BoardMask::fill(width, height, 1),
                regions: vec![],
            },
            free_dominos: vec![],
            fringe: BoardMask::fill(width, height, 0),
            placed_nums: BoardMask::fill(width, height, EMPTY),
            tried: HashSet::new(),
            nodes_searched: 0,
        };
        // add dominos
        for v_domino in v["dominoes"].as_array().unwrap() {
            let (a,b) = (
                v_domino[0].as_number().unwrap().as_u64().unwrap() as u8,
                v_domino[1].as_number().unwrap().as_u64().unwrap() as u8,
            );
            s.free_dominos.push((a,b));
        }
        // add regions, while carving out closed mask
        for v_region in v["regions"].as_array().unwrap() {
            let mut coords: Vec<(usize, usize)> = vec![];
            for coord in v_region["coords"].as_array().unwrap() {
                let (x,y) = (
                    coord[1].as_number().unwrap().as_u64().unwrap() as usize,
                    coord[0].as_number().unwrap().as_u64().unwrap() as usize
                );
                coords.push((x,y));
                s.board.closed.set_coord(x, y, 0);
            }
            let region_type = v_region["type"].as_str().unwrap();
            let region_target = v_region["target"].as_number();
            if region_type != "empty" {
                s.board.regions.push(Region {
                    cond: match (region_type, region_target) {
                        ("equals", None) => Cond::Eq,
                        ("unequal", None) => Cond::Ne,
                        ("less", Some(x)) => Cond::Lt(x.as_u64().unwrap() as u8),
                        ("greater", Some(x)) => Cond::Gt(x.as_u64().unwrap() as u8),
                        ("sum", Some(x)) => Cond::Sum(x.as_u64().unwrap() as u8),
                        _ => panic![],
                    },
                    mask: BoardMask::from_coords(width, height, coords),
                })
            }
        }
        s
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
        placed_nums: BoardMask::fill(4,4, EMPTY),
        free_dominos: vec![
            (0, 0),
            (1, 2),
            (2, 6),
            (5, 5),
            (5, 6),
            (5, 0),
        ],
        fringe: BoardMask::fill(4,4, 0),
        tried: HashSet::new(),
        nodes_searched: 0,
    };

    //easy.solve();

    let json_str = fs::read_to_string("pips-data.json").unwrap();
    let json_data: serde_json::Value = serde_json::from_str(&json_str).unwrap();
    let mut json_state = PipsState::from_json_data(json_data, "medium");
    json_state.print();
    json_state.solve();
    //println!("{}", serde_json::to_string_pretty(&json_data).unwrap());
}
