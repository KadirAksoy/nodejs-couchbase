// controllers/productController.ts
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../config/couchbase";
import { GetResult } from "couchbase";

let productCollection: any;

(async () => {
  const { cluster } = await db();
  const { collection_default } = await db();
  productCollection = collection_default;
})();

// Yeni bir ürün oluşturma
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const id = uuidv4();
    const user = req.user; // Token'dan gelen kullanıcı bilgisine erişim
    const savedProduct = await productCollection.upsert(id, {
      ...product,
      userId: user.id,
    });
    res.status(201).json({
      message: "Ürün başarıyla oluşturuldu",
      data: {
        id,
        savedProduct,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Ürün oluşturma başarısız" });
    console.log(error);
  }
};

// Ürünü ID'ye göre getirme
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const getResult: GetResult = await productCollection.get(id);
    res.status(200).json(getResult.content);
  } catch (error) {
    res.status(500).json({ error: "Ürün getirme başarısız" });
    console.log(error);
  }
};
// Ürünü ID'ye göre güncelleme
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = req.body;
    const updatedProduct = await productCollection.upsert(id, product);
    res.status(200).json({
      message: "Ürün başarıyla güncellendi",
      data: {
        id,
        updatedProduct,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Ürün güncelleme başarısız" });
    console.log(error);
  }
};
// Ürünü ID'ye göre silme
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await productCollection.remove(id);
    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ error: "Ürün silme başarısız" });
    console.log(error);
  }
};
