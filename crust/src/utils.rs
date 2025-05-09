use ::std::ops::Index;
use core::fmt;

#[derive(Debug)]
pub enum MatrixType {
    UpperTriangle,
    LowerTriangle,
    Full,
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

#[derive(Debug)]
pub struct Matrix {
    pub nrows: usize,
    pub ncols: usize,
    pub data: Vec<f64>,
    pub matrix_type: MatrixType,
}

impl Matrix {
    pub fn transpose(&mut self) {
        // let mut transposed = vec![0.0; self.nrows * self.ncols];

        match self.matrix_type {
            MatrixType::Full => {
                let (nrows, ncols) = (self.nrows, self.ncols);
                let mut transposed = vec![0.0; nrows * ncols];

                for i in 0..nrows {
                    for j in 0..ncols {
                        let src_index = i * ncols + j;
                        let dest_index = j * nrows + i;
                        transposed[dest_index] = self.data[src_index].clone();
                    }
                }

                self.data = transposed;
                self.nrows = ncols;
                self.ncols = nrows;
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

pub struct MatrixView<'a> {
    data: &'a [f64],
    nrows: usize,
    ncols: usize,
    get_index: Box<dyn Fn(usize, usize) -> usize + 'a>,
}

impl<'a> MatrixView<'a> {
    pub fn new(data: &'a [f64], nrows: usize, ncols: usize) -> Self {
        assert_eq!(
            nrows * ncols,
            data.len(),
            "data length must match nrows*ncols"
        );
        MatrixView {
            data,
            nrows,
            ncols,
            get_index: Box::new(move |i, j| i * ncols + j),
        }
    }

    pub fn new_upper_triangular(
        data: &'a [f64],
        nrows: usize,
        ncols: usize,
    ) -> Self {
        assert_eq!(
            nrows * (nrows - 1) / 2,
            data.len(),
            "data length must match nrows*(nrows-1)/2"
        );

        MatrixView {
            data,
            nrows,
            ncols,
            get_index: Box::new(move |i, j| {
                if i >= j {
                    usize::MAX // sentinel for masked-out elements
                } else {
                    i * ncols - (i * (i + 1)) / 2 + (j - i - 1)
                }
            }),
        }
    }

    pub fn new_lower_triangular(
        data: &'a [f64],
        nrows: usize,
        ncols: usize,
    ) -> Self {
        assert_eq!(
            nrows * (nrows - 1) / 2,
            data.len(),
            "data length must match nrows*(nrows-1)/2"
        );

        MatrixView {
            data,
            nrows,
            ncols,
            get_index: Box::new(move |i, j| {
                if i <= j {
                    usize::MAX // sentinel for masked-out elements
                } else {
                    i * (i - 1) / 2 + j
                }
            }),
        }
    }

    pub fn new_full(matrix: &'a Matrix) -> Self {
        assert!(matches!(matrix.matrix_type, MatrixType::Full));
        let nrows = matrix.nrows;
        let ncols = matrix.ncols;
        let data = &matrix.data;

        MatrixView {
            data,
            nrows,
            ncols,
            get_index: Box::new(move |i, j| i * ncols + j),
        }
    }

    pub fn transposed(&'a self) -> MatrixView<'a> {
        let previous_get_index_fn = &self.get_index;
        MatrixView {
            data: self.data,
            nrows: self.ncols,
            ncols: self.nrows,
            get_index: Box::new(move |i, j| (*previous_get_index_fn)(j, i)),
        }
    }

    pub fn get(&self, i: usize, j: usize) -> f64 {
        let index = (self.get_index)(i, j);
        if index == usize::MAX {
            0.0
        } else {
            self.data[index]
        }
    }

    pub fn row_permutation(&'a self, row_order: &'a [usize]) -> MatrixView<'a> {
        MatrixView {
            data: self.data,
            nrows: self.nrows,
            ncols: self.ncols,
            get_index: Box::new(move |i, j| row_order[i] * self.ncols + j),
        }
    }

    pub fn col_permutation(&'a self, col_order: &'a [usize]) -> MatrixView<'a> {
        MatrixView {
            data: self.data,
            nrows: self.nrows,
            ncols: self.ncols,
            get_index: Box::new(move |i, j| i * self.ncols + col_order[j]),
        }
    }

    pub fn permutation(
        &'a self,
        row_order: &'a [usize],
        col_order: &'a [usize],
    ) -> MatrixView<'a> {
        MatrixView {
            data: self.data,
            nrows: self.nrows,
            ncols: self.ncols,
            get_index: Box::new(move |i, j| {
                row_order[i] * self.ncols + col_order[j]
            }),
        }
    }
}

impl<'a> fmt::Debug for MatrixView<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("MatrixView")
            .field("data", &self.data) // Slices of f64 are Debug
            .field("nrows", &self.nrows)
            .field("ncols", &self.ncols)
            // For get_index, we can't print the function itself, so we print a placeholder.
            .field("get_index", &"<function>")
            .finish()
    }
}

impl<'a> Index<(usize, usize)> for MatrixView<'a> {
    type Output = f64;

    fn index(&self, index: (usize, usize)) -> &Self::Output {
        let idx = (self.get_index)(index.0, index.1);
        &self.data[idx]
    }
}

pub trait MatrixLike {
    fn nrows(&self) -> usize;
    fn ncols(&self) -> usize;
    fn get(&self, i: usize, j: usize) -> f64;
    fn row(&self, i: usize) -> Vec<f64> {
        (0..self.ncols()).map(|j| self.get(i, j)).collect()
    }
    fn col(&self, j: usize) -> Vec<f64> {
        (0..self.nrows()).map(|i| self.get(i, j)).collect()
    }
}

impl<'a> MatrixLike for MatrixView<'a> {
    fn nrows(&self) -> usize {
        self.nrows
    }
    fn ncols(&self) -> usize {
        self.ncols
    }
    fn get(&self, i: usize, j: usize) -> f64 {
        self.get(i, j)
    }
}

impl MatrixLike for Matrix {
    fn nrows(&self) -> usize {
        self.nrows
    }
    fn ncols(&self) -> usize {
        self.ncols
    }
    fn get(&self, i: usize, j: usize) -> f64 {
        self.get(i, j).unwrap()
    }
}
