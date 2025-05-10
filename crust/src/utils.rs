use ::std::ops::Index;
use core::fmt;

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
