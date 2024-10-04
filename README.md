# iphone-16-availability-checker
Checks Apple Store inventory for new iPhone models
This work is modified open the original poster 'andyzhu7568':
[https://github.com/worthbak/apple-store-inventory-checker](https://github.com/andyzhu7568/iphone-availability-checker)

I added the script for automatically checking inventory every minute and send notifications when found to specified via iMessage email ID!!!

Sending via iMessage uses calling AppleScript from terminal.

### Installation 
1.install node.js:
https://nodejs.org/en
2.Download all files into a folder, open terminal on that folder, run `npm install` to load the project's dependencies. 

### Running the script
First, find the US store number of your local Apple Store using [the included table](./apple-store-numbers-us.md) ([see here for Canadian stores](./apple-store-numbers-canada.md)). Then run the script, passing the number as an argument:

```sh
$ node index.js R301
```

This will query Apple's retail inventory for all 2023 iPhone 15 Pro Max 256gb variants that are known to be stocked in-store. `R301` is a store in Calgary, AB, so that store plus others in the surrouding area will be queried. The results are logged to `stdout`, and if any models are found, a notification will be sent. 

### For other countries

Running the script without a 2nd argument will default to CA stores. Adding a second argument specifies the country.
```sh
$ node index.js R123 US
```

#### Currently Supported Countries
| Countries         | Argument     |
| ----------------- | ------------ |
| United States     | US           |
| Canada            | CA (default) |
| Australia         | AU           |
| Germany           | DE           |
| United Kingdom    | UK           |
| South Korea*      | KR           |
| Hong Kong         | HK           |



### Automatically running script every minute

```sh
$ node scheduler.js
```

### Customization 
This script checks for most known iPhone 15 Pro Max 256gb variants that are currently stocked by Apple Stores near Calgary.
You may want to tweak the code if you're not interested in the other models.

### Apple Store Query URL Pattern
For reference, here's how Apple's fulfillment API works.

```
GET https://www.apple.com/shop/fulfillment-messages
  ?parts.0=MYW43LL%2FA  // URL encoded part number MYW43LL/A
  &parts.1=MYW53LL%2FA  // URL encoded part number MYW53LL/A
  &parts.2=MYW63LL%2FA  // URL encoded part number MYW63LL/A
  ...
  &searchNearby=true    // Instruct the API to search the designated store and the surrounding area
  &store=R172           // Store number (R172 is in Boulder, CO)
```

### Credits
[apple-store-inventory-checker](https://github.com/worthbak/apple-store-inventory-checker)

[iphone-availability-checker](https://github.com/andyzhu7568/iphone-availability-checker)

[applescript](https://www.npmjs.com/package/applescript)



