use crate::tree::Node;

pub enum LinkageFunction {
    Average,
    Ward,
}

impl LinkageFunction {
    fn compute(
        &self,
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &[f64],
        data_matrix: &[f64],
    ) -> f64 {
        match self {
            LinkageFunction::Average => AverageLinkage::compute(
                first_node,
                second_node,
                distance_matrix,
                data_matrix,
            ),
            LinkageFunction::Ward => WardLinkage::compute(
                first_node,
                second_node,
                distance_matrix,
                data_matrix,
            ),
        }
    }
}

pub trait Linkage {
    fn compute(
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &[f64],
        data_matrix: &[f64],
    ) -> f64;
}

pub struct AverageLinkage;

impl Linkage for AverageLinkage {
    fn compute(
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &[f64],
        _data_matrix: &[f64],
    ) -> f64 {
        let n = ((1.0 + (1.0 + 8.0 * (distance_matrix.len() as f64)).sqrt())
            / 2.0) as usize;

        let mut sum = 0.0;

        for &i in &first_node.indices {
            for &j in &second_node.indices {
                // ignore comparisons
                if i == j {
                    continue;
                }
                // indexing works with upper triangular data matrix i must be < j
                let (i, j) = if i > j { (j, i) } else { (i, j) };
                let idx = i * n - (i * (i + 1) / 2) + (j - i - 1);

                sum += distance_matrix[idx];
            }
        }

        sum / (first_node.indices.len() as f64)
            / (second_node.indices.len() as f64)
    }
}

struct WardLinkage;

impl Linkage for WardLinkage {
    fn compute(
        first_node: &Node,
        second_node: &Node,
        _distance_matrix: &[f64],
        data_matrix: &[f64],
    ) -> f64 {
        // let first_centroid = first_node.indices.iter().enumerate()
        // for i in (0..)
        1.0
    }
}
