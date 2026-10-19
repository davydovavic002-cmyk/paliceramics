"use client";

import type { AdminLegal, AdminSiteTexts } from "@/lib/siteTexts";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { canonicalCollectionId, slugifyCatalogId } from "@/lib/catalogConfig";
import { fetchServerInbox, pushContent, setAdminPending } from "@/lib/contentSync";
import {
  ADMIN_UPDATE_EVENT,
  loadAdminData,
  normalizeAdminData,
  saveAdminData,
  seedAdminData,
  type AdminCollection,
  type AdminCategoryItem,
  type AdminPersistedData,
  type AdminPieceType,
  type AdminProduct,
  type AdminSiteCopy,
  type AdminWorkshopSlot,
  type AdminWorkshopType,
  type AdminInboxMessage,
  type AdminFaqItem,
  type AdminReview,
  type AdminContacts,
  type AdminDelivery,
  type AdminAboutBlock,
  type AdminPalinaStory,
  type AdminVoucherContent,
  type AdminWorkshopBookingCopy,
  type AdminWorkshopFormatCopy,
} from "@/lib/adminTypes";

export type AdminSaveState = "idle" | "pending" | "saving" | "saved" | "error";

interface AdminDataContextValue {
  data: AdminPersistedData;
  savedHint: string;
  saveState: AdminSaveState;
  savedAt: number | null;
  /** push to the server right now (no waiting for the debounce) */
  saveNow: () => void;
  flashSaved: () => void;
  /** @deprecated use collections */
  categories: AdminCategoryItem[];
  collections: AdminCollection[];
  pieceTypes: AdminPieceType[];
  addCollection: (nameEn: string) => string | null;
  updateCollection: (id: string, patch: Partial<AdminCollection>) => void;
  removeCollection: (id: string) => void;
  addPieceType: (nameEn: string) => string | null;
  updatePieceType: (id: string, patch: Partial<AdminPieceType>) => void;
  removePieceType: (id: string) => void;
  /** @deprecated */
  addCategory: (label: string) => void;
  /** @deprecated */
  resolveCategoryLabel: (label: string) => string;
  /** @deprecated */
  updateCategory: (id: string, label: string) => void;
  /** @deprecated */
  removeCategory: (id: string) => void;
  products: AdminProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>;
  workshops: AdminWorkshopSlot[];
  setWorkshops: React.Dispatch<React.SetStateAction<AdminWorkshopSlot[]>>;
  workshopTypes: AdminWorkshopType[];
  setWorkshopTypes: React.Dispatch<React.SetStateAction<AdminWorkshopType[]>>;
  siteCopy: AdminSiteCopy;
  updateAnnouncement: (patch: Partial<AdminSiteCopy["announcement"]>) => void;
  updateSpotlight: (patch: Partial<AdminSiteCopy["spotlight"]>) => void;
  updateSectionCopy: (
    section: "gallery" | "workshops" | "about",
    field: keyof AdminSiteCopy["gallery"],
    lang: "en" | "pl",
    value: string
  ) => void;
  updateHeroTag: (lang: "en" | "pl", value: string) => void;
  inbox: AdminInboxMessage[];
  markInboxRead: (id: string) => void;
  toggleInboxRead: (id: string) => void;
  faq: AdminFaqItem[];
  setFaq: React.Dispatch<React.SetStateAction<AdminFaqItem[]>>;
  reviews: AdminReview[];
  setReviews: React.Dispatch<React.SetStateAction<AdminReview[]>>;
  contacts: AdminContacts;
  updateContacts: (patch: Partial<AdminContacts>) => void;
  delivery: AdminDelivery;
  updateDelivery: (patch: Partial<AdminDelivery>) => void;
  aboutBlocks: AdminAboutBlock[];
  setAboutBlocks: React.Dispatch<React.SetStateAction<AdminAboutBlock[]>>;
  palinaStory: AdminPalinaStory;
  setPalinaStory: (next: AdminPalinaStory) => void;
  workshopFormatCopy: AdminWorkshopFormatCopy[];
  setWorkshopFormatCopy: (next: AdminWorkshopFormatCopy[]) => void;
  voucherContent: AdminVoucherContent;
  setVoucherContent: (next: AdminVoucherContent) => void;
  workshopBookingCopy: AdminWorkshopBookingCopy;
  setWorkshopBookingCopy: (next: AdminWorkshopBookingCopy) => void;
  siteTexts: AdminSiteTexts;
  setSiteTexts: (next: AdminSiteTexts) => void;
  legal: AdminLegal;
  setLegal: (next: AdminLegal) => void;
  resetAll: () => void;
}

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminPersistedData>(seedAdminData);
  const [hydrated, setHydrated] = useState(false);
  const [savedHint, setSavedHint] = useState("");
  const [saveState, setSaveState] = useState<AdminSaveState>("idle");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const serverRef = useRef(false);
  const lastPushedRef = useRef<string | null>(null);
  const hintTimerRef = useRef<number | undefined>(undefined);
  const pushTimerRef = useRef<number | undefined>(undefined);
  const pushSeqRef = useRef(0);

  const showHint = useCallback((text: string, ms: number) => {
    setSavedHint(text);
    window.clearTimeout(hintTimerRef.current);
    hintTimerRef.current = window.setTimeout(() => setSavedHint(""), ms);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let server = false;
      let remote: AdminPersistedData | null = null;
      try {
        const session = (await (
          await fetch("/api/admin/session", { cache: "no-store" })
        ).json()) as { authed?: boolean; contentServer?: boolean };
        if (session.authed && session.contentServer) {
          const res = await fetch("/api/admin/content", { cache: "no-store" });
          const json = (await res.json()) as { ok?: boolean; data?: AdminPersistedData | null };
          if (res.ok && json.ok) {
            server = true;
            remote = json.data ?? null;
          }
        }
      } catch {
        server = false;
      }
      if (cancelled) return;

      const local = loadAdminData();
      // Server copy wins; customer messages stay local (they never go to the public file).
      const serverInbox = server ? await fetchServerInbox() : null;
      if (cancelled) return;
      const inbox = serverInbox ?? local?.inbox ?? [];
      const base = remote ? { ...remote, inbox } : { ...(local ?? seedAdminData()), inbox };
      serverRef.current = server;
      lastPushedRef.current = remote ? JSON.stringify(remote) : null;
      setData(normalizeAdminData(base));
      setHydrated(true);
      if (!server) {
        showHint("Server unavailable — changes are saved only in this browser", 6000);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showHint]);

  const doPush = useCallback(
    async (payload: AdminPersistedData) => {
      const seq = ++pushSeqRef.current;
      setSaveState("saving");
      const result = await pushContent(payload);
      if (seq !== pushSeqRef.current) return;
      if (!result.ok) {
        setSaveState("error");
        showHint(
          result.error === "SESSION_EXPIRED"
            ? "Session expired — NOT saved on the server. Log in again."
            : `NOT saved on the server (${result.error}) — check the connection, then edit again`,
          20000
        );
        return;
      }
      lastPushedRef.current = JSON.stringify({ ...result.data, inbox: [] });
      setAdminPending(false);
      setSaveState("saved");
      setSavedAt(Date.now());
      showHint("Saved on the server — visible on all devices", 2800);
      if (result.changed) {
        // photos were moved from the browser into files; swap the heavy copies out
        setData((prev) => (prev === payload ? { ...result.data, inbox: prev.inbox } : prev));
      }
    },
    [showHint]
  );

  const saveNow = useCallback(() => {
    if (!serverRef.current) return;
    window.clearTimeout(pushTimerRef.current);
    void doPush(dataRef.current);
  }, [doPush]);

  useEffect(() => {
    if (!hydrated) return;
    saveAdminData(data);
    if (!serverRef.current) return;

    const { inbox: _inbox, ...publicPart } = data;
    void _inbox;
    const snapshot = JSON.stringify({ ...publicPart, inbox: [] });
    if (snapshot === lastPushedRef.current) return;

    setAdminPending(true);
    setSaveState("pending");
    window.clearTimeout(pushTimerRef.current);
    pushTimerRef.current = window.setTimeout(() => {
      void doPush(data);
    }, 700);
  }, [data, hydrated, doPush]);

  const refreshInbox = useCallback(async () => {
    if (!serverRef.current) return;
    const fresh = await fetchServerInbox();
    if (!fresh) return;
    setData((prev) =>
      JSON.stringify(prev.inbox) === JSON.stringify(fresh)
        ? prev
        : normalizeAdminData({ ...prev, inbox: fresh })
    );
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const tick = () => void refreshInbox();
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    const timer = window.setInterval(tick, 30000);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pali-inbox-changed", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pali-inbox-changed", tick);
    };
  }, [hydrated, refreshInbox]);

  useEffect(() => {
    return () => {
      window.clearTimeout(pushTimerRef.current);
      window.clearTimeout(hintTimerRef.current);
    };
  }, []);

  const flashSaved = useCallback(() => {
    if (serverRef.current) {
      showHint("Saving…", 2400);
    } else {
      showHint("Saved — only in this browser", 2400);
    }
  }, [showHint]);

  const patchData = useCallback(
    (updater: (prev: AdminPersistedData) => AdminPersistedData) => {
      setData(updater);
      flashSaved();
    },
    [flashSaved]
  );

  const addCollection = useCallback(
    (nameEn: string) => {
      const trimmed = nameEn.trim();
      if (!trimmed) return null;
      let id = canonicalCollectionId(slugifyCatalogId(trimmed, "collection"));
      let createdId: string | null = null;
      patchData((prev) => {
        if (prev.collections.some((c) => c.id === id)) {
          return prev;
        }
        if (prev.collections.some((c) => c.name.en.toLowerCase() === trimmed.toLowerCase())) {
          return prev;
        }
        createdId = id;
        return {
          ...prev,
          collections: [
            ...prev.collections,
            {
              id,
              name: { en: trimmed, pl: trimmed },
              subtitle: { en: "", pl: "" },
              showInLookbook: false,
            },
          ],
        };
      });
      return createdId;
    },
    [patchData]
  );

  const updateCollection = useCallback(
    (id: string, patch: Partial<AdminCollection>) => {
      patchData((prev) => ({
        ...prev,
        collections: prev.collections.map((collection) =>
          collection.id === id ? { ...collection, ...patch } : collection
        ),
      }));
    },
    [patchData]
  );

  const removeCollection = useCallback(
    (id: string) => {
      patchData((prev) => {
        if (prev.collections.length <= 1) return prev;
        const fallback = prev.collections.find((c) => c.id !== id)?.id ?? prev.collections[0].id;
        return {
          ...prev,
          collections: prev.collections.filter((c) => c.id !== id),
          products: prev.products.map((product) =>
            product.categoryId === id ? { ...product, categoryId: fallback } : product
          ),
        };
      });
    },
    [patchData]
  );

  const addPieceType = useCallback(
    (nameEn: string) => {
      const trimmed = nameEn.trim();
      if (!trimmed) return null;
      let id = slugifyCatalogId(trimmed, "piece");
      let createdId: string | null = null;
      patchData((prev) => {
        if (prev.pieceTypes.some((type) => type.name.en.toLowerCase() === trimmed.toLowerCase())) {
          return prev;
        }
        if (prev.pieceTypes.some((type) => type.id === id)) {
          id = `${id}-${Date.now().toString(36).slice(-4)}`;
        }
        createdId = id;
        return {
          ...prev,
          pieceTypes: [
            ...prev.pieceTypes,
            {
              id,
              name: { en: trimmed, pl: trimmed },
            },
          ],
        };
      });
      return createdId;
    },
    [patchData]
  );

  const updatePieceType = useCallback(
    (id: string, patch: Partial<AdminPieceType>) => {
      patchData((prev) => ({
        ...prev,
        pieceTypes: prev.pieceTypes.map((pieceType) =>
          pieceType.id === id ? { ...pieceType, ...patch } : pieceType
        ),
      }));
    },
    [patchData]
  );

  const removePieceType = useCallback(
    (id: string) => {
      patchData((prev) => {
        if (prev.pieceTypes.length <= 1) return prev;
        const fallback = prev.pieceTypes.find((type) => type.id !== id)?.id ?? prev.pieceTypes[0].id;
        return {
          ...prev,
          pieceTypes: prev.pieceTypes.filter((type) => type.id !== id),
          products: prev.products.map((product) =>
            product.pieceTypeId === id ? { ...product, pieceTypeId: fallback } : product
          ),
        };
      });
    },
    [patchData]
  );

  const categories = useMemo(
    () =>
      data.collections.map((collection) => ({
        id: collection.id,
        label: collection.name.en,
      })),
    [data.collections]
  );

  const addCategory = useCallback(
    (label: string) => {
      addCollection(label);
    },
    [addCollection]
  );

  const resolveCategoryLabel = useCallback(
    (label: string): string => {
      const trimmed = label.trim();
      if (!trimmed) return data.collections[0]?.id ?? "matte-ash";
      const existing = data.collections.find(
        (collection) => collection.name.en.toLowerCase() === trimmed.toLowerCase()
      );
      if (existing) return existing.id;
      return addCollection(trimmed) ?? data.collections[0]?.id ?? "matte-ash";
    },
    [addCollection, data.collections]
  );

  const updateCategory = useCallback(
    (id: string, label: string) => {
      updateCollection(id, { name: { en: label.trim() || id, pl: label.trim() || id } });
    },
    [updateCollection]
  );

  const removeCategory = useCallback(
    (id: string) => {
      removeCollection(id);
    },
    [removeCollection]
  );

  const setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>> = useCallback(
    (action) => {
      setData((prev) => {
        const next = typeof action === "function" ? action(prev.products) : action;
        return { ...prev, products: next };
      });
      flashSaved();
    },
    [flashSaved]
  );

  const setWorkshops: React.Dispatch<React.SetStateAction<AdminWorkshopSlot[]>> =
    useCallback(
      (action) => {
        setData((prev) => {
          const next = typeof action === "function" ? action(prev.workshops) : action;
          return { ...prev, workshops: next };
        });
        flashSaved();
      },
      [flashSaved]
    );

  const setWorkshopTypes: React.Dispatch<React.SetStateAction<AdminWorkshopType[]>> =
    useCallback(
      (action) => {
        setData((prev) => {
          const next =
            typeof action === "function" ? action(prev.workshopTypes) : action;
          return { ...prev, workshopTypes: next };
        });
        flashSaved();
      },
      [flashSaved]
    );

  const updateAnnouncement = useCallback(
    (patch: Partial<AdminSiteCopy["announcement"]>) => {
      patchData((prev) => ({
        ...prev,
        siteCopy: {
          ...prev.siteCopy,
          announcement: { ...prev.siteCopy.announcement, ...patch },
        },
      }));
    },
    [patchData]
  );

  const updateSpotlight = useCallback(
    (patch: Partial<AdminSiteCopy["spotlight"]>) => {
      patchData((prev) => ({
        ...prev,
        siteCopy: {
          ...prev.siteCopy,
          spotlight: { ...prev.siteCopy.spotlight, ...patch },
        },
      }));
    },
    [patchData]
  );

  const updateSectionCopy = useCallback(
    (
      section: "gallery" | "workshops" | "about",
      field: keyof AdminSiteCopy["gallery"],
      lang: "en" | "pl",
      value: string
    ) => {
      patchData((prev) => ({
        ...prev,
        siteCopy: {
          ...prev.siteCopy,
          [section]: {
            ...prev.siteCopy[section],
            [field]: { ...prev.siteCopy[section][field], [lang]: value },
          },
        },
      }));
    },
    [patchData]
  );

  const updateHeroTag = useCallback(
    (lang: "en" | "pl", value: string) => {
      patchData((prev) => ({
        ...prev,
        siteCopy: {
          ...prev.siteCopy,
          heroTag: { ...prev.siteCopy.heroTag, [lang]: value },
        },
      }));
    },
    [patchData]
  );

  const resetAll = useCallback(() => {
    setData(seedAdminData());
    flashSaved();
  }, [flashSaved]);

  const patchServerInbox = useCallback((id: string, read: boolean) => {
    if (!serverRef.current) return;
    void fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
  }, []);

  const markInboxRead = useCallback(
    (id: string) => {
      patchData((prev) => ({
        ...prev,
        inbox: prev.inbox.map((m) => (m.id === id ? { ...m, read: true } : m)),
      }));
      patchServerInbox(id, true);
    },
    [patchData, patchServerInbox]
  );

  const toggleInboxRead = useCallback(
    (id: string) => {
      const current = dataRef.current.inbox.find((m) => m.id === id);
      patchData((prev) => ({
        ...prev,
        inbox: prev.inbox.map((m) => (m.id === id ? { ...m, read: !m.read } : m)),
      }));
      if (current) patchServerInbox(id, !current.read);
    },
    [patchData, patchServerInbox]
  );


  const setFaq: React.Dispatch<React.SetStateAction<AdminFaqItem[]>> = useCallback(
    (action) => {
      setData((prev) => {
        const next = typeof action === "function" ? action(prev.faq) : action;
        return { ...prev, faq: next };
      });
      flashSaved();
    },
    [flashSaved]
  );

  const setReviews: React.Dispatch<React.SetStateAction<AdminReview[]>> = useCallback(
    (action) => {
      setData((prev) => {
        const next = typeof action === "function" ? action(prev.reviews) : action;
        return { ...prev, reviews: next };
      });
      flashSaved();
    },
    [flashSaved]
  );

  const updateContacts = useCallback(
    (patch: Partial<AdminContacts>) => {
      patchData((prev) => ({
        ...prev,
        contacts: { ...prev.contacts, ...patch },
      }));
    },
    [patchData]
  );

  const updateDelivery = useCallback(
    (patch: Partial<AdminDelivery>) => {
      patchData((prev) => ({
        ...prev,
        delivery: { ...prev.delivery, ...patch },
      }));
    },
    [patchData]
  );

  const setAboutBlocks: React.Dispatch<React.SetStateAction<AdminAboutBlock[]>> =
    useCallback(
      (action) => {
        setData((prev) => {
          const next =
            typeof action === "function" ? action(prev.aboutBlocks) : action;
          return { ...prev, aboutBlocks: next };
        });
        flashSaved();
      },
      [flashSaved]
    );

  const setSiteTexts = useCallback(
    (next: AdminSiteTexts) => {
      patchData((prev) => ({ ...prev, siteTexts: next }));
    },
    [patchData]
  );

  const setLegal = useCallback(
    (next: AdminLegal) => {
      patchData((prev) => ({ ...prev, legal: next }));
    },
    [patchData]
  );

  const setPalinaStory = useCallback(
    (next: AdminPalinaStory) => {
      patchData((prev) => ({ ...prev, palinaStory: next }));
    },
    [patchData]
  );

  const setWorkshopFormatCopy = useCallback(
    (next: AdminWorkshopFormatCopy[]) => {
      patchData((prev) => ({ ...prev, workshopFormatCopy: next }));
    },
    [patchData]
  );

  const setVoucherContent = useCallback(
    (next: AdminVoucherContent) => {
      patchData((prev) => ({ ...prev, voucherContent: next }));
    },
    [patchData]
  );

  const setWorkshopBookingCopy = useCallback(
    (next: AdminWorkshopBookingCopy) => {
      patchData((prev) => ({ ...prev, workshopBookingCopy: next }));
    },
    [patchData]
  );

  const value = useMemo(
    () => ({
      data,
      savedHint,
      saveState,
      savedAt,
      saveNow,
      flashSaved,
      categories,
      collections: data.collections,
      pieceTypes: data.pieceTypes,
      addCollection,
      updateCollection,
      removeCollection,
      addPieceType,
      updatePieceType,
      removePieceType,
      addCategory,
      resolveCategoryLabel,
      updateCategory,
      removeCategory,
      products: data.products,
      setProducts,
      workshops: data.workshops,
      setWorkshops,
      workshopTypes: data.workshopTypes,
      setWorkshopTypes,
      siteCopy: data.siteCopy,
      updateAnnouncement,
      updateSpotlight,
      updateSectionCopy,
      updateHeroTag,
      inbox: data.inbox,
      markInboxRead,
      toggleInboxRead,
      faq: data.faq,
      setFaq,
      reviews: data.reviews,
      setReviews,
      contacts: data.contacts,
      updateContacts,
      delivery: data.delivery,
      updateDelivery,
      aboutBlocks: data.aboutBlocks,
      setAboutBlocks,
      palinaStory: data.palinaStory,
      setPalinaStory,
      workshopFormatCopy: data.workshopFormatCopy,
      setWorkshopFormatCopy,
      voucherContent: data.voucherContent,
      setVoucherContent,
      workshopBookingCopy: data.workshopBookingCopy,
      setWorkshopBookingCopy,
      siteTexts: data.siteTexts,
      setSiteTexts,
      legal: data.legal,
      setLegal,
      resetAll,
    }),
    [
      data,
      savedHint,
      saveState,
      savedAt,
      saveNow,
      flashSaved,
      categories,
      addCollection,
      updateCollection,
      removeCollection,
      addPieceType,
      updatePieceType,
      removePieceType,
      addCategory,
      resolveCategoryLabel,
      updateCategory,
      removeCategory,
      setProducts,
      setWorkshops,
      setWorkshopTypes,
      updateAnnouncement,
      updateSpotlight,
      updateSectionCopy,
      updateHeroTag,
      markInboxRead,
      toggleInboxRead,
      setFaq,
      setReviews,
      updateContacts,
      updateDelivery,
      setAboutBlocks,
      setPalinaStory,
      setWorkshopFormatCopy,
      setVoucherContent,
      setWorkshopBookingCopy,
      setSiteTexts,
      setLegal,
      resetAll,
    ]
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData requires AdminDataProvider");
  return ctx;
}

export function useAdminSiteCopy() {
  const [siteCopy, setSiteCopy] = useState<AdminSiteCopy | null>(null);

  useEffect(() => {
    const sync = () => setSiteCopy(loadAdminData()?.siteCopy ?? null);
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(ADMIN_UPDATE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADMIN_UPDATE_EVENT, sync);
    };
  }, []);

  return siteCopy;
}
