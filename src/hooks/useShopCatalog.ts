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

function readCatalogFromStorage() {
  const data = readAdminDataSync();
  return {
    products: buildShopCatalog(data.products, data.collections),
    collections: data.collections,
    pieceTypes: data.pieceTypes,
  };
}

function readSeedCatalog() {
  const data = seedAdminData();
  return {
    products: buildShopCatalog(data.products, data.collections),
    collections: data.collections,
    pieceTypes: data.pieceTypes,
  };
}

export function useShopCatalog() {
  const seedCatalog = useMemo(() => readSeedCatalog(), []);
  const [products, setProducts] = useState<ShopProduct[]>(seedCatalog.products);
  const [collections, setCollections] = useState<AdminCollection[]>(seedCatalog.collections);
  const [pieceTypes, setPieceTypes] = useState<AdminPieceType[]>(seedCatalog.pieceTypes);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readCatalogFromStorage();
      setProducts(next.products);
      setCollections(next.collections);
      setPieceTypes(next.pieceTypes);
      setCatalogReady(true);
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
    () => ({ products, collections, pieceTypes, catalogReady }),
    [products, collections, pieceTypes, catalogReady]
  );
}
