import React, { useEffect, useContext, useState, useCallback } from "react";
import { UserContext } from "../UserContext";
import Order from "../Order";
import { OrdersService, ProductsService } from "../Service";

function Dashboard() {
  let [orders, setOrders] = useState([]);
  let [showOrderDeletedAlert, setShowOrderDeletedAlert] = useState(false);
  let [showOrderPlacedAlert, setShowOrderPlacedAlert] = useState(false);

  //get context
  let userContext = useContext(UserContext);

  //loadDataFromDatabase function that fetches data from 'orders' array from json file
  let loadDataFromDatabase = useCallback(async () => {
    //load data from database
    let ordersResponse = await fetch(
      `http://localhost:5000/orders?userid=${userContext.user.currentUserId}`,
      { method: "GET" }
    );

    if (ordersResponse.ok) {
      //status code is 200
      let ordersResponseBody = await ordersResponse.json();

      //get all data from products
      let productsResponse = await ProductsService.fetchProducts();
      if (productsResponse.ok) {
        let productsResponseBody = await productsResponse.json();

        //read all orders data
        ordersResponseBody.forEach((order) => {
          order.product = ProductsService.getProductByProductId(
            productsResponseBody,
            order.productId
          );
        });

        console.log(ordersResponseBody);

        setOrders(ordersResponseBody);
      }
    }
  }, [userContext.user.currentUserId]);

  //executes only once - on initial render =  componentDidMount
  useEffect(() => {
    document.title = "Dashboard - eCommerce";

    loadDataFromDatabase();
  }, [userContext.user.currentUserId, loadDataFromDatabase]);

  //When the user clicks on Buy Now
  let onBuyNowClick = useCallback(
    async (orderId, userId, productId, quantity) => {
      if (window.confirm("Do you want to place order for this product?")) {
        let updateOrder = {
          id: orderId,
          productId: productId,
          userId: userId,
          quantity: quantity,
          isPaymentCompleted: true,
        };

        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "PUT",
            body: JSON.stringify(updateOrder),
            headers: { "Content-type": "application/json" },
          }
        );

        let orderResponseBody = await orderResponse.json();
        if (orderResponse.ok) {
          console.log(orderResponseBody);
          loadDataFromDatabase();
          setShowOrderPlacedAlert(true);
        }
      }
    },
    [loadDataFromDatabase]
  );

  //When the user clicks on Delete button
  let onDeleteClick = useCallback(
    async (orderId) => {
      if (window.confirm("Are you sure to delete this item from cart?")) {
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "DELETE",
          }
        );
        if (orderResponse.ok) {
          let orderResponseBody = await orderResponse.json();
          console.log(orderResponseBody);
          setShowOrderDeletedAlert(true);

          loadDataFromDatabase();
        }
      }
    },
    [loadDataFromDatabase]
  );
  return (
    <div className="container mx-auto p-4">
      <div className="w-full py-3 border-b border-gray-300 mb-4">
        <h4 className="text-lg font-semibold flex items-center">
          <i className="fa fa-dashboard"></i> Dashboard{""}
          <button
            className=" mx-4 flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-1   px-4 rounded"
            onClick={loadDataFromDatabase}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 3a7 7 0 00-7 7c0 1.229.324 2.366.883 3.333L3 15v-2.5a1.5 1.5 0 113 0V15a1.5 1.5 0 01-1.5 1.5h-2a1.5 1.5 0 110-3h2v-.667A7 7 0 0110 3zm-1 14.5a1.5 1.5 0 113 0V15a1.5 1.5 0 01-1.5 1.5h-2a1.5 1.5 0 110-3h2v-.667a7 7 0 00-5.883-6.917L7 5v2.5a1.5 1.5 0 11-3 0V5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 110 3h-2v.667A7 7 0 019 16.5z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </button>
        </h4>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 px-2">
            <h4 className="py-2 my-2 text-info border-b border-info">
              <i className="fa fa-history"></i> Previous Orders{" "}
              <span className="badge bg-blue-600 text-white rounded-full px-2 py-1">
                {OrdersService.getPreviousOrders(orders).length}
              </span>
            </h4>

            {OrdersService.getPreviousOrders(orders).length === 0 ? (
              <div className="text-red-600">No Orders</div>
            ) : (
              OrdersService.getPreviousOrders(orders).map((ord) => (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                />
              ))
            )}
          </div>

          <div className="w-full lg:w-1/2 px-2">
            <h4 className="py-2 my-2 text-primary border-b border-primary">
              <i className="fa fa-shopping-cart"></i> Cart{" "}
              <span className="badge bg-blue-600 text-white rounded-full px-2 py-1">
                {OrdersService.getCart(orders).length}
              </span>
            </h4>

            {showOrderPlacedAlert ? (
              <div className="col-12">
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-1"
                  role="alert"
                >
                  <span className="block sm:inline">
                    Your order has been placed.
                  </span>
                  <button
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setShowOrderPlacedAlert(false)}
                  >
                    <span className="text-green-500">&times;</span>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}

            {showOrderDeletedAlert ? (
              <div className="col-12">
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-1"
                  role="alert"
                >
                  <span className="block sm:inline">
                    Your item has been removed from the cart.
                  </span>
                  <button
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setShowOrderDeletedAlert(false)}
                  >
                    <span className="text-red-500">&times;</span>
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}

            {OrdersService.getCart(orders).length === 0 ? (
              <div className="text-red-600">No products in your cart</div>
            ) : (
              OrdersService.getCart(orders).map((ord) => (
                <Order
                  key={ord.id}
                  orderId={ord.id}
                  productId={ord.productId}
                  userId={ord.userId}
                  isPaymentCompleted={ord.isPaymentCompleted}
                  quantity={ord.quantity}
                  productName={ord.product.productName}
                  price={ord.product.price}
                  onBuyNowClick={onBuyNowClick}
                  onDeleteClick={onDeleteClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
