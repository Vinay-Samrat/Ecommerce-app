import React, { useState } from "react";

function Product(props) {
  // Using destructuring to directly extract props.product into prod
  let [prod] = useState(props.product);

  return (
    <div className="w-full sm:w-1/2 px-2 mb-4">
      <div className="bg-white rounded shadow-md p-4">
        <h5 className="text-lg font-semibold flex items-center">
          <i className="fa fa-arrow-right mr-2"></i> {prod.productName}
        </h5>

        <div className="text-xl font-bold">${prod.price.toFixed(2)}</div>
        <div className="mt-2 text-gray-600">
          #{prod.brand.brandName} #{prod.category.categoryName}
        </div>

        <div className="mt-2">
          {[...Array(prod.rating).keys()].map((n) => (
            <i className="fa fa-star text-yellow-500" key={n}></i>
          ))}
          {[...Array(5 - prod.rating).keys()].map((n) => (
            <i className="fa fa-star-o text-yellow-500" key={n}></i>
          ))}
        </div>

        <div className="mt-4 text-right">
          {prod.isOrdered ? (
            <span className="text-blue-500">Added to Cart!</span>
          ) : (
            <button
              className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                props.onAddToCartClick(prod);
              }}
            >
              <i className="fa fa-cart-plus mr-2"></i> Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
