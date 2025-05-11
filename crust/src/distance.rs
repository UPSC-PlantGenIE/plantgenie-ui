use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Copy)]
#[wasm_bindgen]
pub enum DistanceMetric {
    Euclidean,
    Chebyshev,
}

impl DistanceMetric {
    pub fn compute(&self, left: &[f64], right: &[f64]) -> Result<f64, String> {
        match self {
            DistanceMetric::Euclidean => Euclidean.distance(left, right),
            DistanceMetric::Chebyshev => Chebyshev.distance(left, right),
        }
    }
}

pub trait Distance {
    fn distance(&self, left: &[f64], right: &[f64]) -> Result<f64, String> {
        if left.len() != right.len() {
            Err(format!(
                "Length mismatch: a = {}, b = {}",
                left.len(),
                right.len()
            ))
        } else {
            Ok(self.compute(left, right))
        }
    }

    fn compute(&self, left: &[f64], right: &[f64]) -> f64;
}

pub struct Euclidean;

impl Distance for Euclidean {
    fn compute(&self, left: &[f64], right: &[f64]) -> f64 {
        left.iter()
            .zip(right.iter())
            .fold(0.0, |sum, (x, y)| sum + (x - y).powi(2))
    }
}

pub struct Chebyshev;

impl Distance for Chebyshev {
    fn compute(&self, left: &[f64], right: &[f64]) -> f64 {
        left.iter()
            .zip(right.iter())
            .fold(0.0, |max_diff, (x, y)| max_diff.max((x - y).abs()))
    }
}
