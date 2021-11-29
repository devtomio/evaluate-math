extern crate meval;

use napi_derive::napi;

#[napi]
fn evaluate(expr: String) -> f64 {
    let res = meval::eval_str(expr).unwrap();

    res
}
