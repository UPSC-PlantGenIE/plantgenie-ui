use distance::DistanceMetric;
use js_sys::{Uint32Array, Float64Array};
use linkage::{AverageLinkage, Linkage};
use wasm_bindgen::prelude::*;

mod distance;
mod linkage;
mod tree;
mod utils;

use tree::{HcTree, Node};

pub fn euclidean_distance(a: &[f64], b: &[f64]) -> f64 {
    a.iter()
        .zip(b.iter())
        .fold(0.0, |sum, (x, y)| sum + (x - y).powi(2))
}

pub fn average_linkage(
    first_node: &Node,
    second_node: &Node,
    distance_matrix: &[f64],
) -> f64 {
    println!(
        "Average linkage on {} and {}",
        first_node.id, second_node.id
    );
    let n = ((1.0 + (1.0 + 8.0 * (distance_matrix.len() as f64)).sqrt()) / 2.0)
        as usize;

    let mut sum = 0.0;
    println!("{:?}", first_node.indices);
    println!("{:?}", second_node.indices);

    for &i in &first_node.indices {
        for &j in &second_node.indices {
            println!("i={i} j={j} i = j ? {}", i == j);

            if i == j {
                continue;
            }

            let (i, j) = if i > j { (j, i) } else { (i, j) };
            println!("i={i} j={j} i = j ? {}", i == j);

            let idx = i * n - (i * (i + 1) / 2) + (j - i - 1);
            println!("i={i} j={j} index={} n={}", idx, n);

            sum += distance_matrix[idx];
        }
    }

    let average_linkage = sum
        / (first_node.indices.len() as f64)
        / (second_node.indices.len() as f64);

    println!(
        "Avg Link for {} and {} is {average_linkage}",
        first_node.id, second_node.id
    );

    average_linkage
}

pub fn find_nodes_to_merge(
    nodes: &mut Vec<Node>,
    distance_matrix: &[f64],
    data_matrix: &[f64],
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
                distance: AverageLinkage::compute(
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

pub fn reorder_data_matrix_rows(
    data_matrix: &[f64],
    row_order: &[usize],
    ncols: usize,
) -> Vec<f64> {
    let nrows = row_order.len();
    assert_eq!(data_matrix.len(), nrows * ncols);

    // Create a zero-filled output buffer with the correct length
    let mut reordered = vec![0.0; data_matrix.len()];

    for (i, &new_row_index) in row_order.iter().enumerate() {
        let src_start = new_row_index * ncols;
        let src_end = src_start + ncols;
        let dst_start = i * ncols;

        reordered[dst_start..dst_start + ncols]
            .copy_from_slice(&data_matrix[src_start..src_end]);
    }

    reordered
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

#[wasm_bindgen]
pub fn hierarchical_clustering(
    nrows: usize,
    ncols: usize,
    values: &[f64],
) -> HierarchicalClusteringResult {
    println!("Weeeeeeeee're clustering!");

    let mut distance_matrix =
        Vec::<f64>::with_capacity(nrows * (nrows - 1) / 2);

    for (x, chunk_i) in values.chunks(ncols).enumerate() {
        for chunk_j in values.chunks(ncols).skip(x + 1) {
            distance_matrix.push(
                DistanceMetric::Euclidean.compute(chunk_i, chunk_j).unwrap(),
            );
        }
    }

    let mut hc_tree = HcTree::initialize_new_tree(nrows);

    let mut loop_counter = 0;

    loop {
        let num_nodes_without_parent =
            hc_tree.nodes.iter().filter(|x| x.parent.is_none()).count();

        println!("Nodes remaining: {}", num_nodes_without_parent);

        if num_nodes_without_parent < 2 {
            break;
        }
        println!("We're on loop {loop_counter}");
        if loop_counter > 9 {
            break;
        }
        loop_counter += 1;

        find_nodes_to_merge(&mut hc_tree.nodes, &distance_matrix, &values);
    }

    println!("my root node is {:#?}", hc_tree.root().unwrap());
    println!("Number of nodes: {}", hc_tree.nodes.len());

    let before: Vec<usize> = hc_tree
        .preorder_leaf_traversal()
        .map(|node| node.id)
        .collect();

    hc_tree.ladderize();

    let after: Vec<usize> = hc_tree
        .preorder_leaf_traversal()
        .map(|node| node.id)
        .collect();

    println!("{:<30} | {:<30}", "Before ladderize", "After ladderize");
    println!("{}", "-".repeat(65));

    for (before_node, after_node) in before.iter().zip(after.iter()) {
        println!(
            "{:<30} | {:<30}",
            format!("Node id: {}", before_node),
            format!("Node id: {}", after_node)
        );
    }

    let result = reorder_data_matrix_rows(&values, &after, ncols);
    return HierarchicalClusteringResult {
        row_order: (0..nrows).collect::<Vec<usize>>(),
        col_order: (0..ncols).collect::<Vec<usize>>(),
        values: result,
    };
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

        // mutates the data above
        let result = super::hierarchical_clustering(10, 3, &data);

        data.iter()
            .zip(result.values.iter())
            .enumerate()
            .for_each(|(x, (y, z))| println!("{x} - {y} {z}"));
    }
}
