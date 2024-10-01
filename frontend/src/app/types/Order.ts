export interface Order {
  _id: string;
  userId: string;
  items: Item[];
  totalPrice: number;
  date: string;
  __v: number;
}

interface Item {
  productName: string;
  productImage: string;
  productPrice: number;
  productQuantity: number;
  _id: string;
}
