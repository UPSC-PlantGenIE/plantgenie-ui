#[derive(Debug)]
pub struct Node {
    pub id: usize,
    pub parent: Option<usize>,
    pub children: Vec<usize>,
    pub indices: Vec<usize>,
}

impl Node {
    pub fn update_parent(&mut self, index: usize) {
        self.parent = Some(index);
    }

    pub fn get_subtree_size(&self, tree: &HcTree) -> usize {
        if self.children.is_empty() {
            1
        } else {
            self.children
                .iter()
                .filter_map(|child_id| tree.nodes.get(*child_id))
                .map(|child| child.get_subtree_size(tree))
                .sum()
        }
    }
}

pub struct HcTree {
    pub nodes: Vec<Node>,
}

pub struct PreorderIter<'a> {
    tree: &'a HcTree,
    stack: Vec<usize>,
}

pub struct PreOrderLeafIter<'a> {
    inner: PreorderIter<'a>,
}

impl<'a> Iterator for PreorderIter<'a> {
    type Item = &'a Node;

    fn next(&mut self) -> Option<Self::Item> {
        let current_index = self.stack.pop()?;
        let current_node = &self.tree.nodes[current_index];

        // Push children in reverse so the leftmost child is processed first
        for &child_index in current_node.children.iter().rev() {
            self.stack.push(child_index);
        }

        Some(current_node)
    }
}

impl<'a> Iterator for PreOrderLeafIter<'a> {
    type Item = &'a Node;

    fn next(&mut self) -> Option<Self::Item> {
        while let Some(node) = self.inner.next() {
            if node.children.is_empty() {
                return Some(node);
            }
        }
        None
    }
}

impl HcTree {
    pub fn initialize_new_tree(number_of_nodes: usize) -> HcTree {
        let mut nodes: Vec<Node> = (0..number_of_nodes)
            .map(|index| Node {
                id: index,
                parent: None,
                children: Vec::<usize>::with_capacity(2), // nodes should have two children
                indices: vec![index],
            })
            .collect();

        nodes.reserve(number_of_nodes - 1);

        HcTree { nodes }
    }

    pub fn root(&self) -> Option<&Node> {
        self.nodes.last()
    }

    pub fn preorder_node_traversal(&self) -> PreorderIter {
        let root_index = self.nodes.len().checked_sub(1); // assuming root is the last node
        let stack = root_index.map_or_else(Vec::new, |idx| vec![idx]);

        PreorderIter { tree: self, stack }
    }

    pub fn preorder_leaf_traversal(&self) -> PreOrderLeafIter {
        PreOrderLeafIter {
            inner: self.preorder_node_traversal(),
        }
    }

    pub fn ladderize(&mut self) {
        if let Some(root_id) = self.nodes.last().map(|n| n.id) {
            self.ladderize_node(root_id);
        }
    }

    fn ladderize_node(&mut self, node_id: usize) {
        let subtree_sizes = self.nodes[node_id]
            .children
            .iter()
            .map(|&child_id| {
                let size = self.nodes[child_id].get_subtree_size(&self);
                (child_id, size)
            })
            .collect::<Vec<_>>();

        // Sort children in descending order of subtree size
        let sorted_children: Vec<usize> = {
            let mut pairs = subtree_sizes;
            pairs.sort_by_key(|&(_, size)| std::cmp::Reverse(size));
            pairs.into_iter().map(|(id, _)| id).collect()
        };

        self.nodes[node_id].children = sorted_children;

        // ✅ FIX: clone child list *before* recursive calls
        let child_ids = self.nodes[node_id].children.clone();

        for child_id in child_ids {
            self.ladderize_node(child_id);
        }
    }
}
