pub enum MatrixType {
    UpperTriangle,
    LowerTriangle,
    Full,
}

pub struct Matrix {
    pub nrows: usize,
    pub ncols: usize,
    pub data: Vec<f64>,
    pub matrix_type: MatrixType,
}

fn lower_triangular_index(i: usize, j: usize) -> usize {
    // i >= j
    i * (i + 1) / 2 + j
}

fn upper_triangular_index(i: usize, j: usize, ncols: usize) -> usize {
    // i <= j
    let row_offset = i * ncols - (i * (i - 1)) / 2;
    row_offset + (j - i)
}

impl Matrix {
    pub fn transpose(&mut self) {
        let mut transposed = vec![0.0; self.nrows * self.ncols];

        match self.matrix_type {
            MatrixType::Full => {
                for i in 0..self.nrows {
                    for j in 0..self.ncols {
                        let src_index = i * self.ncols + j;
                        let dest_index = j * self.nrows + i;
                        transposed[dest_index] = self.data[src_index];
                    }
                }

                std::mem::swap(&mut self.nrows, &mut self.ncols);

                self.data = transposed;
            }
            MatrixType::LowerTriangle => {
                self.matrix_type = MatrixType::UpperTriangle;
                std::mem::swap(&mut self.nrows, &mut self.ncols);
            }
            MatrixType::UpperTriangle => {
                self.matrix_type = MatrixType::LowerTriangle;
                std::mem::swap(&mut self.nrows, &mut self.ncols);
            }
        }
    }

    pub fn get(&self, i: usize, j: usize) -> Option<f64> {
        if i >= self.nrows || j >= self.ncols {
            return None;
        }

        match self.matrix_type {
            MatrixType::Full => {
                let index = i * self.ncols + j;
                self.data.get(index).copied()
            }
            MatrixType::LowerTriangle => {
                let (row, col) = if i >= j { (i, j) } else { (j, i) };
                let index = lower_triangular_index(row, col);
                self.data.get(index).copied()
            }
            MatrixType::UpperTriangle => {
                let (row, col) = if i <= j { (i, j) } else { (j, i) };
                let index = upper_triangular_index(row, col, self.ncols);
                self.data.get(index).copied()
            }
        }
    }

    pub fn rows(&self) -> impl Iterator<Item = &[f64]> {
        self.data.chunks(self.ncols)
    }

    pub fn reorder_rows(&self, row_order: &[usize]) -> Vec<f64> {
        let mut result = vec![0.0; self.nrows * self.ncols];
        for (i, new_row_index) in row_order.iter().enumerate() {
            let src_start = new_row_index * self.ncols;
            let src_end = src_start + self.ncols;
            let dst_start = i * self.ncols;

            result[dst_start..dst_start + self.ncols]
                .copy_from_slice(&self.data[src_start..src_end]);
        }

        result
    }

    pub fn reorder_rows_in_place(&mut self, row_order: &[usize]) {
        let mut result = vec![0.0; self.nrows * self.ncols];
        for (i, new_row_index) in row_order.iter().enumerate() {
            let src_start = new_row_index * self.ncols;
            let src_end = src_start + self.ncols;
            let dst_start = i * self.ncols;

            result[dst_start..dst_start + self.ncols]
                .copy_from_slice(&self.data[src_start..src_end]);
        }

        self.data.copy_from_slice(&result);
    }
}

pub fn reorder_rows_in_place(data: &mut Vec<f64>, nrows: usize, ncols: usize, row_order: &[usize]) {
    assert_eq!(data.len(), nrows * ncols);
    assert_eq!(row_order.len(), nrows);

    let mut visited = vec![false; nrows];
    let row_len = ncols;

    for start in 0..nrows {
        if visited[start] || row_order[start] == start {
            continue;
        }

        let mut current = start;
        let mut temp_row = vec![0.0; row_len];
        temp_row.copy_from_slice(&data[current * row_len..(current + 1) * row_len]);

        while !visited[current] {
            let next = row_order[current];
            visited[current] = true;

            if next == start {
                let current_row = &mut data[current * row_len..(current + 1) * row_len];
                current_row.copy_from_slice(&temp_row);
                break;
            }

            {
                // We get two disjoint mutable slices to avoid double borrowing
                let (lo, hi) = data.split_at_mut(std::cmp::max(current, next) * row_len);
                let (src, dst) = if current < next {
                    let dst = &mut lo[current * row_len..(current + 1) * row_len];
                    let src = &hi[..row_len];
                    (src, dst)
                } else {
                    let src = &lo[next * row_len..(next + 1) * row_len];
                    let dst = &mut hi[..row_len];
                    (src, dst)
                };
                dst.copy_from_slice(src);
            }

            current = next;
        }
    }
}

