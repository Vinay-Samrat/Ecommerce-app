import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { BrandsService, CategoriesService} from "./Service";
import Product from "./Product";

function Store() {
  //state
  let [brands, setBrands] = useState([]);
  let [categories, setCategories] = useState([]);
  let [products, setProducts] = useState([]);
  let [productsToShow, setProductsToShow] = useState([]);
  let [search, setSearch] = useState("");

  //get user context
  let userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      //get brands from db
      let brandsResponse = await BrandsService.fetchBrands();
      let brandsResponseBody = await brandsResponse.json();
      brandsResponseBody.forEach((brand) => {
        brand.isChecked = true;
      });
      setBrands(brandsResponseBody);

      //get categories from db
      let categoriesResponse = await CategoriesService.fetchCategories();
      let categoriesResponseBody = await categoriesResponse.json();
      categoriesResponseBody.forEach((category) => {
        category.isChecked = true;
      });
      setCategories(categoriesResponseBody);

      //get products from db
      let productsResponse = await fetch(
        `http://localhost:5000/products?productName_like=${search}`,
        { method: "GET" }
      );
      let productsResponseBody = await productsResponse.json();
      if (productsResponse.ok) {
        productsResponseBody.forEach((product) => {
          //set brand
          product.brand = BrandsService.getBrandByBrandId(
            brandsResponseBody,
            product.brandId
          );

          //set category
          product.category = CategoriesService.getCategoryByCategoryId(
            categoriesResponseBody,
            product.categoryId
          );
          product.isOrdered = false;
        });

        setProducts(productsResponseBody);
        setProductsToShow(productsResponseBody);
        document.title = "Store - eCommerce";
      }
    })();
  }, [search]);

  //updateBrandIsChecked
  let updateBrandIsChecked = (id) => {
    let brandsData = brands.map((brd) => {
      if (brd.id === id) brd.isChecked = !brd.isChecked;
      return brd;
    });

    setBrands(brandsData);
    updateProductsToShow();
  };

  //updateCategoryIsChecked
  let updateCategoryIsChecked = (id) => {
    let categoryData = categories.map((cat) => {
      if (cat.id === id) cat.isChecked = !cat.isChecked;
      return cat;
    });

    setCategories(categoryData);
    updateProductsToShow();
  };

  //updateProductsToShow
  let updateProductsToShow = () => {
    setProductsToShow(
      products
        .filter((prod) => {
          return (
            categories.filter(
              (category) =>
                category.id === prod.categoryId && category.isChecked
            ).length > 0
          );
        })
        .filter((prod) => {
          return (
            brands.filter(
              (brand) => brand.id === prod.brandId && brand.isChecked
            ).length > 0
          );
        })
    );
  };

  //When the user clicks on Add to Cart function
  let onAddToCartClick = (prod) => {
    (async () => {
      let newOrder = {
        userId: userContext.user.currentUserId,
        productId: prod.id,
        quantity: 1,
        isPaymentCompleted: false,
      };

      let orderResponse = await fetch(`http://localhost:5000/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });

      if (orderResponse.ok) {
        //isOrdered = true
        let prods = products.map((p) => {
          if (p.id === prod.id) p.isOrdered = true;
          return p;
        });

        setProducts(prods);
        updateProductsToShow();
      } else {
        console.log(orderResponse);
      }
    })();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row py-3 items-center justify-between bg-gray-100">
        <div className="flex items-center mb-2 md:mb-0">
          <h4 className="text-xl font-semibold text-gray-800">
            <i className="fa fa-shopping-bag"></i> Store{" "}
            <span className="ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1">
              {productsToShow.length}
            </span>
          </h4>
        </div>

        <div className="w-full md:w-1/2">
          <input
            type="search"
            value={search}
            placeholder="Search"
            className="w-full p-2 border rounded focus:outline-none focus:ring"
            autoFocus="autofocus"
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 py-2">
          <div className="my-2">
            <h5 className="text-lg font-semibold">Brands</h5>
            <ul className="list-none p-0">
              {brands.map((brand) => (
                <li className="my-1" key={brand.id}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={brand.isChecked}
                      onChange={() => {
                        updateBrandIsChecked(brand.id);
                      }}
                      id={`brand${brand.id}`}
                    />
                    <label className="ml-2" htmlFor={`brand${brand.id}`}>
                      {brand.brandName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-2">
            <h5 className="text-lg font-semibold">Categories</h5>
            <ul className="list-none p-0">
              {categories.map((category) => (
                <li className="my-1" key={category.id}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={category.isChecked}
                      onChange={() => {
                        updateCategoryIsChecked(category.id);
                      }}
                      id={`category${category.id}`}
                    />
                    <label className="ml-2" htmlFor={`category${category.id}`}>
                      {category.categoryName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productsToShow.map((prod) => (
              <Product
                key={prod.id}
                product={prod}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;
