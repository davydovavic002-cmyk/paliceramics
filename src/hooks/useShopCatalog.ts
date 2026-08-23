"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  readAdminDataSync,
  seedAdminData,
  type AdminCollection,
  type AdminPieceType,
} from "@/lib/adminTypes";
import {
  buildShopCatalog,
  type ShopProduct,
} from "@/lib/shopCatalog";

function readCatalog() {
  const data = typeof window === "undefined" ? seedAdminData() : readAdminDataSync();
  return {
    products: buildShopCatalog(data.products, data.collections),
    collections: data.collections,
    pieceTypes: data.pieceTypes,
  };
}

export function useShopCatalog() {
  const [products, setProducts] = useState<ShopProduct[]>(() => readCatalog().products);
  const [collections, setCollections] = useState<AdminCollection[]>(() => readCatalog().collections);
  const [pieceTypes, setPieceTypes] = useState<AdminPieceType[]>(() => readCatalog().pieceTypes);

  useEffect(() => {
    const sync = () => {
      const next = readCatalog();
      setProducts(next.products);
      setCollections(next.collections);
      setPieceTypes(next.pieceTypes);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return useMemo(
    () => ({ products, collections, pieceTypes, ready: true }),
    [products, collections, pieceTypes]
  );
}
