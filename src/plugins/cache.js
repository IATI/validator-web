import * as localForage from "localforage";
import addMinutes from "date-fns/addMinutes";
import isAfter from "date-fns/isAfter";

// expires is the number of minutes the cache should expire
const setCache = (name, value, expires = 5) => {
  localForage.setItem(name, { data: value, expiry: addMinutes(new Date(), expires) });
};

const hasExpired = (expires) => {
  if (expires) {
    const expiryDate = new Date(expires);
    return isAfter(new Date(), expiryDate);
  }

  return true;
};

const getCache = async (name) => {
  const item = await localForage.getItem(name);
  if (!item) return null;
  if (hasExpired(item.expiry)) {
    localForage.setItem(name, null);

    return null;
  }

  return item.data;
};

export default {
  install: (app, options) => {
    localForage.config({
      driver: localForage.LOCALSTORAGE,
      name: "validator-cache",
      storeName: "validator-store",
    });

    app.provide("cache", {
      get: getCache,
      set: (name, value) => setCache(name, value, options.expires),
      clear: localForage.clear,
    });
  },
};
