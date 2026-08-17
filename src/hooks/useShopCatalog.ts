"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_UPDATE_EVENT,
  loadAdminData,
  seedAdminData,
  type AdminCollection,
  type AdminPieceType,
} from "@/lib/adminTypes";
import {
  buildShopCatalog,
  type ShopProduct,
} from "@/lib/shopCatalog";

export function useShopCatalog() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [pieceTypes, setPieceTypes] = useState<AdminPieceType[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const data = loadAdminData() ?? seedAdminData();
      setProducts(buildShopCatalog(data.products, data.collections));
      setCollections(data.collections);
      setPieceTypes(data.pieceTypes);
      setReady(true);
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
    () => ({ products, collections, pieceTypes, ready }),
    [products, collections, pieceTypes, ready]
  );
}
