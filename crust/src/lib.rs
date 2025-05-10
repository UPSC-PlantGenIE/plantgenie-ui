use js_sys::{Float64Array, Uint32Array};
use utils::{MatrixLike, MatrixView};
use wasm_bindgen::prelude::*;

mod distance;
mod linkage;
mod tree;
mod utils;

use crate::distance::DistanceMetric;
use crate::linkage::LinkageFunction;
use crate::tree::{HcTree, Node};

#[wasm_bindgen]
#[derive(Debug, Clone, Copy)]
pub enum ClusteringAxis {
    Row,
    Column,
    Both,
}

pub fn find_nodes_to_merge_with_view(
    nodes: &mut Vec<Node>,
    distance_matrix: &MatrixView,
    data_matrix: &MatrixView,
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
                distance: linkage.compute_from_views(
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

pub fn compute_distance_matrix_from_view(
    data_matrix: &MatrixView,
    distance: DistanceMetric,
) -> Vec<f64> {
    let mut distance_matrix: Vec<f64> = Vec::<f64>::with_capacity(
        data_matrix.nrows() * (data_matrix.nrows() - 1) / 2,
    );

    for i in 0..data_matrix.nrows() {
        let row_i_vect: Vec<f64> = data_matrix.row(i);
        for j in i + 1..data_matrix.nrows() {
            let row_j_vect: Vec<f64> = data_matrix.row(j);
            distance_matrix
                .push(distance.compute(&row_i_vect, &row_j_vect).unwrap());
        }
    }

    distance_matrix
}

pub fn cluster_with_views(
    data_matrix: &MatrixView,
    distance: DistanceMetric,
    linkage: LinkageFunction,
) -> Vec<usize> {
    let mut tree = HcTree::initialize_new_tree(data_matrix.nrows());

    let distance_matrix_flat =
        compute_distance_matrix_from_view(data_matrix, distance);

    let distance_matrix = MatrixView::new_upper_triangular(
        &distance_matrix_flat,
        data_matrix.nrows(),
        data_matrix.nrows(),
    );

    loop {
        let num_nodes_without_parent =
            tree.nodes.iter().filter(|x| x.parent.is_none()).count();

        // println!("Nodes remaining: {}", num_nodes_without_parent);

        if num_nodes_without_parent < 2 {
            break;
        }

        find_nodes_to_merge_with_view(
            &mut tree.nodes,
            &distance_matrix,
            &data_matrix,
            linkage,
        );
    }

    let row_order: Vec<usize> = tree
        .ladderized_preorder_node_view()
        .filter(|node| node.children.len() == 0)
        .map(|node| node.id)
        .collect();

    row_order
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
    let data_matrix = MatrixView::new(&values, nrows, ncols);

    let (row_order, col_order) = match axis {
        ClusteringAxis::Both => (
            cluster_with_views(&data_matrix, distance, linkage),
            cluster_with_views(&data_matrix.transposed(), distance, linkage),
        ),

        ClusteringAxis::Row => (
            cluster_with_views(&data_matrix, distance, linkage),
            (0..ncols).collect(),
        ),

        ClusteringAxis::Column => (
            (0..nrows).collect(),
            cluster_with_views(&data_matrix.transposed(), distance, linkage),
        ),
    };

    HierarchicalClusteringResult {
        values: {
            let permutation_view = data_matrix
                .permutation(row_order.as_slice(), col_order.as_slice());
            (0..permutation_view.nrows())
                .flat_map(|i| permutation_view.row(i))
                .collect()
        },
        row_order,
        col_order,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cluster_with_views_test() {
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

        let result = super::hierarchical_clustering(
            10,
            3,
            data,
            super::ClusteringAxis::Row,
            super::LinkageFunction::Average,
            super::DistanceMetric::Chebyshev,
        );

        result
            .row_order
            .iter()
            .enumerate()
            .for_each(|(x, y)| println!("{x}, {y}"));
    }

    #[test]
    fn matrix_view_test() {
        let data: Vec<f64> = vec![
            1.0, 2.0, 3.0, // row 0
            2.0, 3.0, 4.0, // row 1
            3.0, 4.0, 5.0, // row 2
            8.0, 8.0, 8.0, // row 3
        ];

        let matrix_view = super::MatrixView::new(&data, 4, 3);

        println!("{:#?}", matrix_view);

        for (index, value) in data.iter().enumerate() {
            let matrix_value = matrix_view.get(index / 3, index % 3);
            println!("{matrix_value} {}", *value);
            assert_eq!(matrix_value, *value);
        }
    }

    #[test]
    fn matrix_view_transpose_test() {
        let data: Vec<f64> = vec![
            1.0, 0.0, 0.0, 0.0, // row 0
            2.0, 1.0, 0.0, 0.0, // row 1
            3.0, 4.0, 1.0, 0.0, // row 2
            5.0, 6.0, 7.0, 1.0, // row 3
        ];

        let matrix_view = super::MatrixView::new(&data, 4, 4);
        let transposed_view = matrix_view.transposed();

        assert_eq!(transposed_view.nrows(), 4);
        assert_eq!(transposed_view.ncols(), 4);

        for (index, value) in data.iter().enumerate() {
            let matrix_value = matrix_view.get(index % 4, index / 4);
            let transposed_matrix_value =
                transposed_view.get(index / 4, index % 4);
            println!(
                "{index} {} {} {matrix_value} {transposed_matrix_value} {}",
                index / 4,
                index % 4,
                *value
            );
            assert_eq!(matrix_value, transposed_matrix_value);
        }
    }

    #[test]
    fn matrix_view_upper_triangular_test() {
        let full_data: Vec<f64> = vec![
            0.0, 1.0, 2.0, 3.0, // row 0
            0.0, 0.0, 4.0, 5.0, // row 1
            0.0, 0.0, 0.0, 6.0, // row 2
            0.0, 0.0, 0.0, 0.0, // row 3
        ];

        let trig_data: Vec<f64> = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0];

        let full_view = MatrixView::new(&full_data, 4, 4);
        let trig_view = MatrixView::new_upper_triangular(&trig_data, 4, 4);

        for (index, value) in full_data.iter().enumerate() {
            let matrix_value = full_view.get(index % 4, index / 4);
            let trig_matrix_value = trig_view.get(index % 4, index / 4);
            println!(
                "{index} {} {} {trig_matrix_value} {matrix_value} {}",
                index / 4,
                index % 4,
                *value
            );
            assert_eq!(matrix_value, trig_matrix_value);
        }
    }

    #[test]
    fn matrix_view_lower_triangular_test() {
        let full_data: Vec<f64> = vec![
            0.0, 1.0, 2.0, 3.0, // row 0
            0.0, 0.0, 4.0, 5.0, // row 1
            0.0, 0.0, 0.0, 6.0, // row 2
            0.0, 0.0, 0.0, 0.0, // row 3
        ];

        let trig_data: Vec<f64> = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0];

        let full_view = MatrixView::new(&full_data, 4, 4);
        let transposed_full_view = full_view.transposed();
        let trig_view = MatrixView::new_upper_triangular(&trig_data, 4, 4);

        for (index, value) in full_data.iter().enumerate() {
            let transposed_matrix_value =
                transposed_full_view.get(index / 4, index % 4);
            let trig_matrix_value = trig_view.get(index % 4, index / 4);
            println!(
                "{index} {} {} {trig_matrix_value} {transposed_matrix_value} {}",
                index / 4,
                index % 4,
                *value
            );
            assert_eq!(transposed_matrix_value, trig_matrix_value);
        }
    }

    fn create_test_tree_for_ladderized_traversal() -> HcTree {
        let mut nodes = Vec::new();

        // Leaves: L0, L1, L2, L3, L4
        // Node 0 (L0) - Subtree size: 1
        nodes.push(Node {
            id: 0,
            parent: None,
            children: vec![],
            indices: vec![0],
        });
        // Node 1 (L1) - Subtree size: 1
        nodes.push(Node {
            id: 1,
            parent: None,
            children: vec![],
            indices: vec![1],
        });
        // Node 2 (L2) - Subtree size: 1
        nodes.push(Node {
            id: 2,
            parent: None,
            children: vec![],
            indices: vec![2],
        });
        // Node 3 (L3) - Subtree size: 1
        nodes.push(Node {
            id: 3,
            parent: None,
            children: vec![],
            indices: vec![3],
        });
        // Node 4 (L4) - Subtree size: 1
        nodes.push(Node {
            id: 4,
            parent: None,
            children: vec![],
            indices: vec![4],
        });

        // Internal node N3 (id 5), parent of L1(id 1) and L2(id 2)
        // Children: L1 (size 1), L2 (size 1). Initial order [1, 2].
        // Ladderized order for children: [1, 2] (stable sort). Subtree size: 2
        nodes.push(Node {
            id: 5, // N3
            parent: None,
            children: vec![1, 2], // L1, L2
            indices: vec![1, 2],
        });
        nodes[1].parent = Some(5);
        nodes[2].parent = Some(5);

        // Internal node N2 (id 6), parent of L3(id 3) and L4(id 4)
        // Children: L3 (size 1), L4 (size 1). Initial order [3, 4].
        // Ladderized order for children: [3, 4] (stable sort). Subtree size: 2
        nodes.push(Node {
            id: 6, // N2
            parent: None,
            children: vec![3, 4], // L3, L4
            indices: vec![3, 4],
        });
        nodes[3].parent = Some(6);
        nodes[4].parent = Some(6);

        // Internal node N1 (id 7), parent of L0(id 0) and N3(id 5)
        // Children: L0 (size 1), N3 (size 2). Initial order [0, 5].
        // Ladderized order for children: [5, 0] (N3, L0). Subtree size: 3
        nodes.push(Node {
            id: 7, // N1
            parent: None,
            children: vec![0, 5], // L0 (smaller), N3 (larger)
            indices: vec![0, 1, 2],
        });
        nodes[0].parent = Some(7);
        nodes[5].parent = Some(7);

        // Root node R (id 8), parent of N1(id 7) and N2(id 6)
        // Children: N1 (size 3), N2 (size 2). Initial order [6, 7] (N2 is smaller).
        // Ladderized order for children: [7, 6] (N1, N2). Subtree size: 5
        nodes.push(Node {
            id: 8, // R
            parent: None,
            children: vec![6, 7], // N2 (smaller), N1 (larger)
            indices: vec![0, 1, 2, 3, 4],
        });
        nodes[6].parent = Some(8); // N2's parent is R
        nodes[7].parent = Some(8); // N1's parent is R

        HcTree { nodes }
    }

    #[test]
    fn ladderize_tree_test() {
        let tree = create_test_tree_for_ladderized_traversal();

        let visited_ids: Vec<usize> = tree
            .ladderized_preorder_node_view() // Uses the view/iterator
            .map(|node| node.id)
            .collect();

        let expected_order = vec![8, 7, 5, 1, 2, 0, 6, 3, 4];

        assert_eq!(
            visited_ids, expected_order,
            "Ladderized preorder traversal order mismatch for binary tree"
        );
    }
}
