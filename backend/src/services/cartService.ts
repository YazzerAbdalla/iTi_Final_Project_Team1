import productModel from "../models/productModel";
import userModel from "../models/userModel";
import cartModel from "../models/cartModel";
import orderModel, { IOrderItem } from "../models/orderModel";

interface CreateNewCartProp {
  userId: string;
}

export async function createNewCart({
  userId,
}: CreateNewCartProp): Promise<any> {
  try {
    const cart = await cartModel.create({ userId });
    return cart;
  } catch (error) {
    console.error("Error creating new cart:", error);
  }
}

interface ClearCartForUser {
  userId: string;
}
export async function clearCartForUser({ userId }: ClearCartForUser) {
  try {
    const cart = await getActiveCart({ userId });

    if (!cart) return { data: "Some wrong in fetching cart", statusCode: 400 };
    cart.items = [];
    cart.totalPrice = 0;
    cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error: any) {
    console.log("Error in clearing cart for user.", error.message);
    return { data: "Error in clearnig cart for user.", statusCode: 500 };
  }
}

interface GetActiveCartProp {
  userId: string;
}
export async function getActiveCart({ userId }: GetActiveCartProp) {
  try {
    // find active cart for user by userId, not _id
    let activeCart = await cartModel.findOne({ userId, status: "active" });

    if (!activeCart) {
      activeCart = await createNewCart({ userId });
    }

    return activeCart;
  } catch (error) {
    console.error("Error fetching active cart:", error);
  }
}

interface AddItemToCartProp {
  userId: string;
  itemId: any;
  quantity: number;
}

export async function addItemToCart({
  userId,
  itemId,
  quantity,
}: AddItemToCartProp) {
  try {
    const cart = await getActiveCart({ userId });

    if (!cart) return { data: "Some wrong in fetching cart", statusCode: 400 };

    const product = await productModel.findById(itemId);
    if (!product) {
      return { data: "This product not found.", statusCode: 404 };
    }

    // Check if the item already exists in the cart
    const existsItemInCart = cart.items.find(
      (p) => p.productId.toString() === itemId
    );
    if (existsItemInCart) {
      existsItemInCart.quantity += quantity;
    } else {
      const newItem = {
        productId: itemId,
        unitPrice: product.price,
        quantity,
      };
      cart.items.push(newItem);
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    await cart.save();

    return { data: cart, statusCode: 200 };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return { data: "Error adding item to cart.", statusCode: 500 };
  }
}

interface RemoveItemFromCart {
  userId: string;
  itemId: any;
}
export async function removeItemFromCart({
  userId,
  itemId,
}: RemoveItemFromCart) {
  try {
    let cart = await getActiveCart({ userId });
    if (!cart) {
      return { data: "Some wrong in fetching cart", statusCode: 400 };
    }
    const existsItemInCart = cart.items.find(
      (p) => p.productId.toString() === itemId
    );
    if (!existsItemInCart) {
      return {
        data: "The item arleady not exist in the cart",
        statusCode: 400,
      };
    }

    cart.items = cart.items.filter((p) => {
      return p.productId.toString() !== itemId;
    });

    // Recalculate total price
    cart.totalPrice -= existsItemInCart.quantity * existsItemInCart.unitPrice;
    await cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error) {
    console.error("Error in removing item from cart:", error);
    return { data: "Error in removing item from the cart", statusCode: 500 };
  }
}

interface UpdateItemInCart {
  userId: string;
  itemId: any;
  quantity: number;
}

export async function updateItemInCart({
  userId,
  itemId,
  quantity,
}: UpdateItemInCart) {
  try {
    const cart = await getActiveCart({ userId });
    if (!cart) {
      return { data: "Some wrong in fetching cart", statusCode: 400 };
    }
    const existsItemInCart = cart.items.find(
      (p) => p.productId.toString() === itemId
    );
    if (!existsItemInCart) {
      return {
        data: "The item not exist in the cart",
        statusCode: 400,
      };
    }

    existsItemInCart.quantity = quantity;
    const cartRestItems = (cart.items = cart.items.filter((p) => {
      return p.productId.toString() !== itemId;
    }));
    cart.items = cartRestItems;

    // insert the item after updated.
    cart.items.push(existsItemInCart);

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    await cart.save();
    return { data: cart, statusCode: 200 };
  } catch (error: any) {
    console.log("Error in updating item in cart", error.message);
    return { data: "Error in updating item in cart", statusCode: 500 };
  }
}

interface Checkout {
  userId: string;
}
export async function checkout({ userId }: Checkout) {
  try {
    const cart = await getActiveCart({ userId });
    if (!cart) {
      return { data: "Some wrong in fetching cart", statusCode: 400 };
    }
    let orderItems: IOrderItem[] = [];
    for (const item of cart.items) {
      const product = await productModel.findById(item.productId);
      if (!product) {
        return {
          data: `Product not found for item with ID: ${item.productId}`,
          statusCode: 400,
        };
      }
      const newOrder: IOrderItem = {
        productImage: product.image,
        productName: product.title,
        productPrice: product.price,
        productQuantity: item.quantity,
      };
      orderItems.push(newOrder);
    }

    const order = await orderModel.create({
      userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
    });
    cart.status = "completed";
    await cart.save();
    return { data: order, statusCode: 200 };
  } catch (error: any) {
    console.log("Error in checkout the cart", error.message);
    return { data: "Error in checkout the cart", statusCode: 500 };
  }
}
