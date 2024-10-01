import orderModel from "../models/orderModel";

export async function getOrderForUser(userId: string) {
  try {
    let order = await orderModel.find({ userId });
    return { data: order, statusCode: 200 };
  } catch (error) {
    return { data: "Something wrong in fetchin order", statusCode: 500 };
  }
}
