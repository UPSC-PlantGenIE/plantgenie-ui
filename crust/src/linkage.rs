use wasm_bindgen::prelude::*;

use crate::{
    distance::{Distance, Euclidean},
    tree::Node,
    utils::{MatrixLike, MatrixView},
};

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum LinkageFunction {
    Average,
    Ward,
}

impl LinkageFunction {
    pub fn compute_from_views(
        &self,
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &MatrixView,
        data_matrix: &MatrixView,
    ) -> f64 {
        match self {
            LinkageFunction::Average => AverageLinkage::compute_from_views(
                first_node,
                second_node,
                distance_matrix,
                data_matrix,
            ),
            LinkageFunction::Ward => WardLinkage::compute_from_views(
                first_node,
                second_node,
                distance_matrix,
                data_matrix,
            ),
        }
    }
}

pub trait Linkage {
    fn compute_from_views(
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &MatrixView,
        data_matrix: &MatrixView,
    ) -> f64;
}

pub struct AverageLinkage;

impl Linkage for AverageLinkage {
    fn compute_from_views(
        first_node: &Node,
        second_node: &Node,
        distance_matrix: &MatrixView,
        _data_matrix: &MatrixView,
    ) -> f64 {
        let mut sum = 0.0;

        for &i in &first_node.indices {
            for &j in &second_node.indices {
                if i == j {
                    continue;
                }
                // indexing works with upper triangular data matrix i must be < j
                let (i, j) = if i > j { (j, i) } else { (i, j) };
                // let idx = i * n - (i * (i + 1) / 2) + (j - i - 1);
                sum += distance_matrix.get(i, j);
            }
        }

        sum / (first_node.indices.len() as f64)
            / (second_node.indices.len() as f64)
    }
}

pub struct WardLinkage;

impl Linkage for WardLinkage {
    fn compute_from_views(
        first_node: &Node,
        second_node: &Node,
        _distance_matrix: &MatrixView,
        data_matrix: &MatrixView,
    ) -> f64 {
        let first_centroid_node_count = first_node.indices.len() as f64;
        let mut first_centroid = vec![0.0; data_matrix.ncols()];

        for col_idx in 0..data_matrix.ncols() {
            for row_idx in first_node.indices.iter() {
                first_centroid[col_idx] += data_matrix.get(*row_idx, col_idx);
            }
            first_centroid[col_idx] /= first_centroid_node_count;
        }

        let second_centroid_node_count = second_node.indices.len() as f64;
        let mut second_centroid = vec![0.0; data_matrix.ncols()];

        for col_idx in 0..data_matrix.ncols() {
            for row_idx in second_node.indices.iter() {
                second_centroid[col_idx] += data_matrix.get(*row_idx, col_idx);
            }
            second_centroid[col_idx] /= second_centroid_node_count;
        }

        let centroid_distance =
            Euclidean.compute(&first_centroid, &second_centroid);

        (((first_centroid_node_count + second_centroid_node_count)
            / (first_centroid_node_count * second_centroid_node_count))
            * centroid_distance.powi(2))
        .sqrt()
    }
}
