import {
  mockCustomers,
  mockDownloads,
  mockElements,
  mockElementCategories,
  mockExperiences,
  mockOrders,
  mockPosts,
  mockSubscribers,
} from "@/lib/mockData";

type Store = {
  experiences: typeof mockExperiences;
  elements: typeof mockElements;
  elementCategories: typeof mockElementCategories;
  downloads: typeof mockDownloads;
  orders: typeof mockOrders;
  customers: typeof mockCustomers;
  subscribers: typeof mockSubscribers;
  posts: typeof mockPosts;
};


declare global {
  // eslint-disable-next-line no-var
  var __mockStore: Store | undefined;
}

export const getMockStore = () => {
  if (!globalThis.__mockStore) {
    globalThis.__mockStore = {
      experiences: [...mockExperiences],
      elements: [...mockElements],
      elementCategories: [...mockElementCategories],
      downloads: [...mockDownloads],
      orders: [...mockOrders],
      customers: [...mockCustomers],
      subscribers: [...mockSubscribers],
      posts: [...mockPosts],
    };
  }

  if (globalThis.__mockStore.downloads?.length) {
    const fallbackMap = new Map(
      mockDownloads.map((item) => [item.slug, item.details || ""])
    );
    const showOnHomeMap = new Map(
      mockDownloads.map((item) => [item.slug, item.showOnHome || false])
    );
    globalThis.__mockStore.downloads = globalThis.__mockStore.downloads.map((item) => {
      if (item.details && item.details.trim()) return item;
      const details = fallbackMap.get(item.slug) || "";
      const showOnHome = showOnHomeMap.get(item.slug) || false;
      return details || showOnHome ? { ...item, details, showOnHome } : item;
    });
  }

  if (globalThis.__mockStore.experiences?.length) {
    const detailsMap = new Map(
      mockExperiences.map((item) => [item.slug, item.details || ""])
    );
    globalThis.__mockStore.experiences = globalThis.__mockStore.experiences.map((item) => {
      if (item.details && item.details.trim()) return item;
      const details = detailsMap.get(item.slug) || "";
      return details ? { ...item, details } : item;
    });
  }

  return globalThis.__mockStore;
};
