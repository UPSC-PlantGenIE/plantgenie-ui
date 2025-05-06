use js_sys::{Float64Array, Uint32Array};
use wasm_bindgen::prelude::*;

mod distance;
mod linkage;
mod tree;
mod utils;

use crate::distance::DistanceMetric;
use crate::linkage::{AverageLinkage, Linkage, LinkageFunction, WardLinkage};
use crate::tree::{HcTree, Node};
use crate::utils::Matrix;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum ClusteringAxis {
    Row,
    Column,
    Both,
}

pub fn find_nodes_to_merge(
    nodes: &mut Vec<Node>,
    distance_matrix: &[f64],
    data_matrix: &Matrix,
    linkage: LinkageFunction,
) {
    let mut pairs: Vec<LinkageResult> =
        Vec::with_capacity(nodes.len() * (nodes.len() - 1) / 2);

    for (i, first_node) in nodes.iter().enumerate() {
        if first_node.parent.is_some() {
            continue;
        }
        for second_node in nodes.iter().skip(i + 1) {
            if second_node.parent.is_some() {
                continue;
            }

            pairs.push(LinkageResult {
                first_index: first_node.id,
                second_index: second_node.id,
                distance: linkage.compute(
                    first_node,
                    second_node,
                    distance_matrix,
                    data_matrix,
                ),
            });
        }
    }

    let best_pair = pairs
        .iter()
        .reduce(|acc, current| {
            if current.distance < acc.distance {
                current
            } else {
                acc
            }
        })
        .unwrap();

    let indices: Vec<usize> = nodes[best_pair.first_index]
        .indices
        .iter()
        .chain(nodes[best_pair.second_index].indices.iter())
        .cloned()
        .collect();

    let next_index = nodes.len();
    nodes[best_pair.first_index].update_parent(next_index);
    nodes[best_pair.second_index].update_parent(next_index);

    nodes.push(Node {
        id: next_index,
        parent: None,
        children: vec![best_pair.first_index, best_pair.second_index],
        indices,
    });
}

struct LinkageResult {
    first_index: usize,
    second_index: usize,
    distance: f64,
}

#[wasm_bindgen]
pub struct HierarchicalClusteringResult {
    row_order: Vec<usize>,
    col_order: Vec<usize>,
    values: Vec<f64>,
}

#[wasm_bindgen]
impl HierarchicalClusteringResult {
    #[wasm_bindgen(constructor)]
    pub fn new(
        row_order: Vec<usize>,
        col_order: Vec<usize>,
        values: Vec<f64>,
    ) -> Self {
        HierarchicalClusteringResult {
            row_order,
            col_order,
            values,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn row_order(&self) -> Uint32Array {
        let converted: Vec<u32> =
            self.row_order.iter().map(|&x| x as u32).collect();
        Uint32Array::from(converted.as_slice())
    }

    #[wasm_bindgen(getter)]
    pub fn col_order(&self) -> Uint32Array {
        let converted: Vec<u32> =
            self.col_order.iter().map(|&x| x as u32).collect();
        Uint32Array::from(converted.as_slice())
    }

    #[wasm_bindgen(getter)]
    pub fn values(&self) -> Float64Array {
        Float64Array::from(self.values.as_slice())
    }
}

pub fn cluster(
    data_matrix: &Matrix,
    distance_matrix: &[f64],
    linkage: LinkageFunction,
) -> (Vec<usize>, Vec<f64>) {
    let mut tree = HcTree::initialize_new_tree(data_matrix.nrows);

    loop {
        let num_nodes_without_parent =
            tree.nodes.iter().filter(|x| x.parent.is_none()).count();

        println!("Nodes remaining: {}", num_nodes_without_parent);

        if num_nodes_without_parent < 2 {
            break;
        }

        find_nodes_to_merge(
            &mut tree.nodes,
            &distance_matrix,
            &data_matrix,
            linkage,
        );
    }

    tree.ladderize();

    let row_order: Vec<usize> =
        tree.preorder_leaf_traversal().map(|node| node.id).collect();

    let values = data_matrix.reorder_rows(&row_order);

    (row_order, values)
}

#[wasm_bindgen]
pub fn hierarchical_clustering(
    nrows: usize,
    ncols: usize,
    values: Vec<f64>,
    axis: ClusteringAxis,
    linkage: LinkageFunction,
    distance: DistanceMetric,
) -> HierarchicalClusteringResult {
    println!("Weeeeeeeee're clustering!");

    let mut data_matrix = Matrix {
        nrows,
        ncols,
        data: values,
        matrix_type: utils::MatrixType::Full,
    };

    let mut distance_matrix =
        Vec::<f64>::with_capacity(nrows * (nrows - 1) / 2);

    for (x, chunk_i) in data_matrix.rows().enumerate() {
        for chunk_j in data_matrix.rows().skip(x + 1) {
            distance_matrix.push(
                distance.compute(chunk_i, chunk_j).unwrap(),
                // DistanceMetric::Euclidean.compute(chunk_i, chunk_j).unwrap(),
            )
        }
    }

    let results = match axis {
        ClusteringAxis::Both => {
            let (row_order, _values) =
                cluster(&data_matrix, &distance_matrix, linkage);
            data_matrix.reorder_rows_in_place(&row_order);
            data_matrix.transpose();
            let (col_order, values) =
                cluster(&data_matrix, &distance_matrix, linkage);
            data_matrix.reorder_rows_in_place(&col_order);
            data_matrix.transpose();
            HierarchicalClusteringResult {
                row_order,
                col_order,
                values,
            }
        }

        ClusteringAxis::Row => {
            let (row_order, values) =
                cluster(&data_matrix, &distance_matrix, linkage);
            data_matrix.reorder_rows_in_place(&row_order);
            HierarchicalClusteringResult {
                row_order,
                values,
                col_order: (0..data_matrix.ncols).collect(),
            }
        }

        ClusteringAxis::Column => {
            data_matrix.transpose();
            let (col_order, values) =
                cluster(&data_matrix, &distance_matrix, linkage);
            data_matrix.reorder_rows_in_place(&col_order);
            data_matrix.transpose();
            HierarchicalClusteringResult {
                col_order,
                values,
                row_order: (0..data_matrix.nrows).collect(),
            }
        }
    };

    // let mut hc_tree = HcTree::initialize_new_tree(nrows);

    // loop {
    //     let num_nodes_without_parent =
    //         hc_tree.nodes.iter().filter(|x| x.parent.is_none()).count();

    //     println!("Nodes remaining: {}", num_nodes_without_parent);

    //     if num_nodes_without_parent < 2 {
    //         break;
    //     }

    //     find_nodes_to_merge(&mut hc_tree.nodes, &distance_matrix, &data_matrix);
    // }

    // println!("my root node is {:#?}", hc_tree.root().unwrap());
    // println!("Number of nodes: {}", hc_tree.nodes.len());

    // let before: Vec<usize> = hc_tree
    //     .preorder_leaf_traversal()
    //     .map(|node| node.id)
    //     .collect();

    // hc_tree.ladderize();

    // let after: Vec<usize> = hc_tree
    //     .preorder_leaf_traversal()
    //     .map(|node| node.id)
    //     .collect();

    // println!("{:<30} | {:<30}", "Before ladderize", "After ladderize");
    // println!("{}", "-".repeat(65));

    // for (before_node, after_node) in before.iter().zip(after.iter()) {
    //     println!(
    //         "{:<30} | {:<30}",
    //         format!("Node id: {}", before_node),
    //         format!("Node id: {}", after_node)
    //     );
    // }

    // let result = data_matrix.reorder_rows(&after);

    // return HierarchicalClusteringResult {
    //     row_order: after,
    //     col_order: (0..ncols).collect::<Vec<usize>>(),
    //     values: result,
    // };
    return results;
}

#[cfg(test)]
mod tests {
    #[test]
    fn cluster_test() {
        let data: Vec<f64> = vec![
            1.0, 2.0, 3.0, // row 0
            2.0, 3.0, 4.0, // row 1
            3.0, 4.0, 5.0, // row 2
            8.0, 8.0, 8.0, // row 3
            1.0, 0.0, 1.0, // row 4
            0.0, 1.0, 0.0, // row 5
            6.0, 5.0, 4.0, // row 6
            9.0, 9.0, 9.0, // row 7
            2.0, 2.0, 2.0, // row 8
            5.0, 5.0, 5.0, // row 9
        ];

        // let data: Vec<f64> = vec![
        //     // Cluster A under Euclidean
        //     1.0, 1.0, 1.0, // row 0
        //     2.0, 2.0, 2.0, // row 1
        //     3.0, 3.0, 3.0, // row 2
        //     // Cluster B under Chebyshev
        //     0.0, 0.0, 10.0, // row 3
        //     0.0, 0.0, 11.0, // row 4
        //     0.0, 0.0, 12.0, // row 5
        //     // These are outliers under Chebyshev but close in Euclidean to cluster A
        //     1.0, 1.0, 10.0, // row 6
        //     2.0, 2.0, 10.0, // row 7
        //     // Separate cluster in both
        //     50.0, 50.0, 50.0, // row 8
        //     51.0, 51.0, 51.0, // row 9
        // ];

        let data_clone = data.clone();

        // mutates the data above
        let result = super::hierarchical_clustering(
            10,
            3,
            data,
            super::ClusteringAxis::Row,
            super::LinkageFunction::Average,
            super::DistanceMetric::Chebyshev,
        );

        // data_clone
        //     .iter()
        //     .zip(result.values.iter())
        //     .enumerate()
        //     .for_each(|(x, (y, z))| println!("{x} - {y} {z}"));

        result
            .row_order
            .iter()
            .enumerate()
            .for_each(|(x, y)| println!("{x}, {y}"));
    }
}
