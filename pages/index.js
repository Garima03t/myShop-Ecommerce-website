import Layout from "@/components/Layout";
import ProductItem from "@/components/ProductItem";
import Product from "@/models/Product";
import db from "@/utils/db";
import { Store } from "@/utils/Store";
import axios from "axios";
import Link from "next/link";
import { useContext } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { toast } from "react-toastify";
import { engage } from "./api/engage";
import { useEffect } from "react";

export const maxDuration = 50; // This function can run for a maximum of 50 seconds
export default function Home({ featuredProducts, products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  useEffect(() => {
    if (engage !== undefined) {
      sendPageViewEvent();
    };
  }, []);
  const sendPageViewEvent = async () => {
    const response = await engage.pageView({
      channel: "WEB",
      currency: process.env.CURRENCY,
      page: "home",
    });   
    //For testing and debugging purposes only
    if (response) {
       console.log("bid:", engage.getBrowserId());
    }
   
  };
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((item) => item.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity: quantity },
    });

    toast.success("Product added to the cart");
    const eventData = {
      channel: "WEB",
      currency: process.env.CURRENCY,
      pointOfSale: process.env.POC,
      language: "EN",
      page: "products", 
      product: {
          name: product.name,
          type: product.category,
          item_id: product.slug,
          productId: product._id,
          referenceId: "order_"+product.name,
          orderedAt: new Date().toISOString(),
          quantity: 1,
          price: product.price,
          currency: process.env.CURRENCY,
          originalPrice: product.price,
          originalCurrencyCode: process.env.CURRENCY,
      }
    };
    const extensionData = {
      customKey: "Test"
    };
    await engage.event("ADD", eventData, extensionData);
  };
  
  return (
    <Layout title="MyShop">
      <div className="z-0">
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          {featuredProducts.map((product) => (
            <div key={product._id}>
              <Link href={`/product/${product.slug}`} passHref>
                <div className="flex">
                  <img src={product.banner} alt={product.name} />
                </div>
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
      <h1 className="h2 my-4">Latest Products</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  const featuredProducts = products.filter(
    (product) => product.isFeatured === true
  );
  await db.disconnect();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}
