const COUNTRIES = {
  US: {
    "storePath": "",
    "skuCode": "LL",
  },
  AE: { // UAE Apple Stores do not appear to support in-store pickup
    "storePath": "/ae",
    "skuCode": "AE",
  },
  CA: {
    "storePath": "/ca",
    "skuCode": "LL",
  },
  AU: {
    "storePath": "/au",
    "skuCode": "X",
  },
  DE: {
    "storePath": "/de",
    "skuCode": "D",
  },
  UK: {
    "storePath": "/uk",
    "skuCode": "B",
  },
  KR: { // South Korean Apple Stores do not appear to support in-store pickup
    "storePath": "/kr",
    "skuCode": "KH",
  },
  HK: {
    "storePath": "/hk",
    "skuCode": "ZP",
  },
  IN: {
    "storePath": "/in",
    "skuCode": "HN",
  }
};

module.exports = {
  COUNTRIES: COUNTRIES,
};
