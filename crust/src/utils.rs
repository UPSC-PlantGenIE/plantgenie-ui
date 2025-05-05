pub enum MatrixType {
    UpperTriangle,
    LowerTriangle,
    Full,
}

pub struct Matrix {
    nrows: usize,
    ncols: usize,
    data: Vec<f64>,
    matrix_type: MatrixType,
}

impl Matrix {
    fn transpose(&mut self) {
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
            },
            MatrixType::LowerTriangle => {
                self.matrix_type = MatrixType::UpperTriangle;
                std::mem::swap(&mut self.nrows, &mut self.ncols);
            },
            MatrixType::UpperTriangle => {
                self.matrix_type = MatrixType::LowerTriangle;
                std::mem::swap(&mut self.nrows, &mut self.ncols);
            }
        }
    }
}
