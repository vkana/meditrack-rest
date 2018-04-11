'use strict';
const axios = require('axios');
const stores = require('../../stores.json');

let item = {};

const wmStoreSearch = (upc, store) => {
  let url = `https://search.mobile.walmart.com/v1/products-by-code/UPC/${upc}`;
  let storePrice = {
    no:store.no,
    address: store.address || store.streetAddress,
    zip: store.zip
  }
  return axios.get(url, {
    params: {storeId: store.no}
  })
  .then(response =>
  {

    let data = response.data.data;
    if (data.inStore && data.inStore.price && data.inStore.price.priceInCents) {
      storePrice = {
        ...storePrice,
        price: data.inStore.price.priceInCents / 100,
        stock: (data.inStore.inventory) ? data.inStore.inventory.status : 'NA'
      };

      if (!item.sku) {
        item = {
          name: data.common.name,
          sku: data.common.productId.wwwItemId,
          upc: data.common.productId.upca,
          url: data.common.productUrl,
          bsUrl: `https://www.brickseek.com/walmart-inventory-checker?sku=${data.common.productId.wwwItemId}`,
          offerType: data.common.offerType,
        };
      }
    }

    return storePrice;
   })
  .catch(err => {
  });
}

const searchStores = async (upc, start, numStores) => {
  let allStores = stores.allStores;
  let storePrices = [];
  let promiseArray = [];
  let errorCount = 0;
  item = {};

  allStores.slice(start, start + numStores).map(store => {
    promiseArray.push(wmStoreSearch(upc, store).catch(err=>{errorCount++}));
  });

  await Promise.all(promiseArray).then(resultArray => {
    storePrices = resultArray;
  })

  return storePrices;
}

exports.search_stores = async (req, res) => {
  let upc = req.params.productId;
  let start = parseInt(req.query.start) || 0;
  let numStores = parseInt(req.query.stores) || 100;
  let storePrices = await searchStores(upc, start, numStores);
  storePrices = storePrices.filter(s => s && s.price);
  let resp = {
    item,
    storePrices
  };

  res.json(resp);
};
