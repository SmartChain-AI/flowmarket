

## Endpoint: (Set info)
fetch("https://market-api.ufcstrike.com/sets/162");
## Returns:
{
    "setId": 162,
    "seriesId": 3,
    "editionSize": 1603,
    "metadata": {
        ...
    }
}
--------------------------------------------

## Endpoint: (Set Listings)
fetch("https://market-api.ufcstrike.com/sets/287/listings-info");
## Options:
?sort=price&order=asc

## Returns:
{
    "setId":287,
    "listingsCount":32,
    "lowestAsk":"8",
    "averageSalesPrice":"10.25"
}
--------------------------------------------

## Endpoint: (Set Circulation)
fetch("https://market-api.ufcstrike.com/sets/287/circulation");
## Returns:
{
    "setId": 287,
    "seriesId": 3,
    "editionSize": 760,
    "mintedCount": 760,
    "burnedCount": 69,
    "ownedCount": 691,
    "inUnopenedPackCount": 0,
    "inReservesCount": 69
}
--------------------------------------------

## Endpoint: (Set Sales)
fetch("https://market-api.ufcstrike.com/sets/287/sales?sort=latest&full=0");
## Options:
?sort=latest or ?sort=top
&full=0 or &full=1
## Returns:
{
    "setId":287,
    "sales":[
        {"timestamp":"2024-06-29T16:32:47.000Z","nft_id":"2207186","price":8,"listing_resource_id":"122045791543206","storefront_address":"113864b7d80045a6","edition_number":528},
        {"timestamp":"2024-06-27T07:19:23.000Z","nft_id":"2206848","price":8,"listing_resource_id":"46179489214551","storefront_address":"a6e3b0955c1aa2f6","edition_number":190},
        ...
        ]
}
--------------------------------------------

## Endpoint: (Moment)
fetch("https://market-api.ufcstrike.com/moments/2207186");
## Returns:
{
    "id": 2207186,
    "owner": "0xf5dfdae9f6f87f92",
    "burned": false,
    "setId": 287,
    "seriesId": 3,
    "editionNumber": 528,
    "editionSize": 760,
    "metadata": {
        ...
    },
    "listing": {
        block_height: "80417110"
        edition_number: 727
        listing_resource_id: "204509163576892"
        nft_id: "2570716"
        price: "33"
        storefront_address: "0x9ca2ddd25b5fbd4b"
        timestamp: "2024-06-15T17:52:52.000Z"
        transaction_id: "fb1386ab5b8669580ef3bdeeff057ee1911504a04ede7d412dc9f6c808b7568f"
    }
}
--------------------------------------------

## Endpoint: (Get all sets)
fetch("https://market-api.ufcstrike.com/search/sets", {
  "body": "{\"sort\":\"listing_timestamp\",\"order\":\"desc\",\"query\":null,\"limit\":12,\"max_mintings\":{},\"price\":{},\"weight_class\":[],\"highlight_type\":[],\"athlete_name\":[],\"tier\":[],\"set\":[],\"id\":[]}",
  "method": "POST"
});
## Returns:
{sets: 
    0: {set_id: 178, max_editions: 618, series_id: 3, listing_timestamp: 1719678954,…}
    listing_price: "30"
    listing_timestamp: 1719678954
    max_editions: 618
    metadata: {SET: "Base", TIER: "Fandom", name: "ALEX PEREIRA | UFC 276 | KO/TKO",…}
    name: "ALEX PEREIRA | UFC 276 | KO/TKO"
    series_id: 3
    set_id: 178
    ...
    totalCount: 419
}
--------------------------------------------

## Endpoint: (Get all sets)
fetch("https://market-api.ufcstrike.com/search/moments", {
  "content-type": "application/json",
  "body": "{\"sort\":\"deposit_block_height\",\"order\":\"desc\",\"query\":null,\"limit\":12,\"owner\":\"9ca2ddd25b5fbd4b\"}",
  "method": "POST"
});
## Returns:
{
    moments: {
        "nft_id": 1841098,
        "set_id": 201,
        "edition_number": 1391,
        "max_editions": 2360,
        "series_id": 3,
        "name": "ADRIAN YANEZ | UFC FIGHT NIGHT JUNE 18, 2022 | KO/TKO",
        "deposit_block_height": "78128183",
        "listing_price": null,
        "metadata": {
        ...
        }
    },
    totalCount: 301
}