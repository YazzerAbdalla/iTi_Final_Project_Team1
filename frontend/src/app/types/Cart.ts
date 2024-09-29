export interface Cart {
  data: Data;
}

interface Data {
  _id: string;
  userId: string;
  totalPrice: number;
  status: string;
  items: Item[];
  __v: number;
}

interface Item {
  productId: string;
  unitPrice: number;
  productImage: string;
  productName: string;
  quantity: number;
  _id: string;
}
