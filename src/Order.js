import React from "react";

function Order(props) {
  console.log("Order rendered", props);
  return (
    <div className="my-2 shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="p-4">
        <h6 className="text-lg font-semibold flex items-center justify-between">
          <span>
            <i className="fa fa-arrow-right mr-2"></i> {props.productName}
          </span>
          {!props.isPaymentCompleted && (
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => {
                  props.onBuyNowClick(
                    props.orderId,
                    props.userId,
                    props.productId,
                    props.quantity
                  );
                }}
              >
                <i className="fa fa-truck mr-1"></i> Buy Now
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => {
                  props.onDeleteClick(props.orderId);
                }}
              >
                <i className="fa fa-trash-o mr-1"></i> Delete
              </button>
            </div>
          )}
        </h6>

        <table className="table-auto mt-2 w-full">
          <tbody>
            <tr>
              <td className="w-24 text-gray-500">Quantity:</td>
              <td>{props.quantity}</td>
            </tr>
            <tr>
              <td className="w-24 text-gray-500">Price:</td>
              <td>${props.price}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(Order);
