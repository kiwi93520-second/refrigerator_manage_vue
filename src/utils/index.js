export const StoredCategories = {
  0: "Expired",
  1: "Soon to expire",
  2: "Refrigerated",
  3: "Frozen",
  4: "Cabinet",
};

export const Ingredient = {
  0: {
    name: "Eggs",
    storeDate: newDate(),
    expireDate: new Date() + 2,
    Stored: StoredCategories[1],
  },
  1: {
    name: "Eggs",
    storeDate: newDate(),
    expireDate: new Date() + 30,
    Stored: StoredCategories[3],
  },
  2: {
    name: "Eggs",
    storeDate: newDate(),
    expireDate: new Date(),
    Stored: StoredCategories[0],
  },
};
