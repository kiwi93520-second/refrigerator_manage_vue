import { ref } from "vue";

export const StorageCategories = {
  refrigerated: "Refrigerated",
  frozen: "Frozen",
  cabinet: "Cabinet",
};
export const StatusCategories = {
  expired: "Expired",
  soon: "Soon to expire",
  fresh: "Fresh",
};

function getMyDate(dat = Date.now()) {
  const date = new Date(dat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const Ingredient = ref([
  {
    id: 1,
    name: "Eggs",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 2 * 86400000),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.soon,
  },
  {
    id: 2,
    name: "Eggs",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 2 * 86400000),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.soon,
  },
  {
    id: 3,
    name: "Eggs",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 2 * 86400000),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.soon,
  },
  {
    id: 4,
    name: "Eggs",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 2 * 86400000),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.soon,
  },
  {
    id: 5,
    name: "Eggs",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 2 * 86400000),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.soon,
  },
  {
    id: 6,
    name: "Eggs2",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 7,
    name: "Eggs2",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 8,
    name: "Eggs2",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 9,
    name: "eeeeee",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 10,
    name: "Eggs2",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 11,
    name: "Eggs2",
    storeDate: getMyDate(),
    expireDate: getMyDate(Date.now() + 30 * 86400000),
    storage: StorageCategories.frozen,
    status: StatusCategories.fresh,
  },
  {
    id: 12,
    name: "Eggs3",
    storeDate: getMyDate(),
    expireDate: getMyDate(),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.expired,
  },
  {
    id: 13,
    name: "Eggs3",
    storeDate: getMyDate(),
    expireDate: getMyDate(),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.expired,
  },
  {
    id: 14,
    name: "Eggs3",
    storeDate: getMyDate(),
    expireDate: getMyDate(),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.expired,
  },
  {
    id: 15,
    name: "Eggs3",
    storeDate: getMyDate(),
    expireDate: getMyDate(),
    storage: StorageCategories.refrigerated,
    status: StatusCategories.expired,
  },
]);
