"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  readAdminDataSync,
  type AdminCollection,
  type AdminPieceType,
} from "@/lib/adminTypes";
import {
  buildShopCatalog,
  type ShopProduct,
} from "@/lib/shopCatalog";

function readCatalogFromStorage() {
  const data = readAdminDataSync();
  return {
    products: buildShopCatalog(data.products, data.collections),
    collections: data.collections,
    pieceTypes: data.pieceTypes,
  };
}

export function useShopCatalog() {
  const initialCatalog = useMemo(() => readCatalogFromStorage(), []);
  const [products, setProducts] = useState<ShopProduct[]>(initialCatalog.products);
  const [collections, setCollections] = useState<AdminCollection[]>(initialCatalog.collections);
  const [pieceTypes, setPieceTypes] = useState<AdminPieceType[]>(initialCatalog.pieceTypes);

  useEffect(() => {
    const sync = () => {
      const next = readCatalogFromStorage();
      setProducts(next.products);
      setCollections(next.collections);
      setPieceTypes(next.pieceTypes);
    };
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return useMemo(
    () => ({ products, collections, pieceTypes }),
    [products, collections, pieceTypes]
  );
}
