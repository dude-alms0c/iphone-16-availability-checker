const request = require("request");
const notifier = require("node-notifier");
const flatMap = require('array.prototype.flatmap');
const replaceAll = require("string.prototype.replaceall");

flatMap.shim();
replaceAll.shim();

const { COUNTRIES } = require("./constants");
const args = process.argv.slice(2);

let skusForCountry = (countrySkuCode) => {
  return {
    [`MYW53LL/A`]: `iPhone Pro Max 256gb Desert Titanium`,
    [`MYW63LL/A`]: 'iPhone Pro Max 256gb Natural Titanium',
    [`MYW43LL/A`]: 'iPhone Pro Max 256gb White Titanium',
    [`MYW33LL/A`]: 'iPhone Pro Max 256gb Black Titanium',
    [`MYW73LL/A`]: 'iPhone Pro Max 512gb Black Titanium',
    [`MYW83LL/A`]: 'iPhone Pro Max 512gb White Titanium',
    [`MYW93LL/A`]: 'iPhone Pro Max 512gb Desert Titanium',
    [`MYWA3LL/A`]: 'iPhone Pro Max 512gb Natural Titanium'
  }
}

let favouritesForCountry = (countrySkuCode) => {
  return [
    `MYW53LL/A`,
    `MYW93LL/A`,
    `MYW63LL/A`,
    `MYW43LL/A`,
  ]
}

const control = "MYW53LL/A";
let storeNumber = "R130"; 
let state = "OK";
let country = "US"

if (args.length > 0) {
  const passedStore = args[0];
  country = (args[1] ? args[1] : "US").toUpperCase();
  if (passedStore.charAt(0) === "R") {
    // All retail store numbers start with R
    storeNumber = passedStore;
    state = null;
  }
}

const countryConfig = COUNTRIES[country];

let storePath = countryConfig["storePath"];
let skuList = skusForCountry(countryConfig["skuCode"]);
let favorites = favouritesForCountry(countryConfig["skuCode"]);

const query =
  Object.keys(skuList)
    .map((k, i) => `parts.${i}=${encodeURIComponent(k)}`)
    .join("&") + `&store=${storeNumber}`;
    .join("&") + `&searchNearby=true&store=${storeNumber}`;

let options = {
  method: "GET",
  url: `https://www.apple.com${storePath}/shop/fulfillment-messages?` + query,
};

request(options, function (error, response) {
  if (error) throw new Error(error);

  const body = JSON.parse(response.body);
  const storesArray = body.body.content.pickupMessage.stores;
  let skuCounter = {};
  let hasStoreSearchError = false;

  console.log('Inventory');
  console.log('---------');
  const statusArray = storesArray
    .flatMap((store) => {
      if (state && state !== store.state) return null;

      const name = store.storeName;
      let productStatus = [];

      for (const [key, value] of Object.entries(skuList)) {
        const product = store.partsAvailability[key];

        hasStoreSearchError = product.storeSearchEnabled !== true;

        if (key === control && hasStoreSearchError !== true) {
          hasStoreSearchError = product.pickupDisplay !== "available";
        } else {
          productStatus.push(`${value}: ${product.pickupDisplay}`);

          if (product.pickupDisplay === "available") {
            console.log(`${value} in stock at ${store.storeName}`);
            let count = skuCounter[key] ? skuCounter[key] : 0;
            count += 1;
            skuCounter[key] = count;
          }
        }
      }

      return {
        name: name,
        products: productStatus,
      };
    })
    .filter((n) => n);

  let hasError = hasStoreSearchError;

  const inventory = Object.entries(skuCounter)
    .map(([key, value]) => `${skuList[key]}: ${value}`)
    .join(" | ");

  console.log('\nInventory counts');
  console.log('----------------');
  console.log(inventory.replaceAll(" | ", "\n"));
  let hasUltimate = Object.keys(skuCounter).some(
    (r) => favorites.indexOf(r) >= 0
  );
  let notificationMessage;

  if (inventory) {
    notificationMessage = `${hasUltimate ? "FOUND iPhone 16 Pros! " : ""
      }Some models found: ${inventory}`;
  } else {
    notificationMessage = "No models found.";
    console.log(statusArray);
    console.log(notificationMessage);
  }

  const message = notificationMessage;

  if (message != "No models found.") {
  notifier.notify({
    title: "iPhone 16 Pro Max Availability",
    message: message,
    sound:  inventory,
    timeout: false,
  })
  
  var applescript = require('applescript');
var script = ['tell application "Messages"',
              'set myid to get id of first account',
              'set theBuddy to participant "abc@efg.com" of account id myid',
              'send "' + message +  ' Oklahoma ' +  '" to theBuddy',
              'end tell' ];
              
applescript.execString(script.join("\r\n"), function(err, rtn) {
  if (err) {
    // Something went wrong!
    console.log(err);
  }
  if (Array.isArray(rtn)) {
  }
});
  
  }else {
  };

  // Log time at end
  console.log(`\nGenerated: ${new Date().toLocaleString()}`);
});
