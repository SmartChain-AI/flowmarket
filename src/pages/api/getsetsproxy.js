import httpProxy from 'http-proxy'

const API_URL = "https://market-api.ufcstrike.com/sets/" // The actual URL of your API

const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

const post_data_sets = {
  "sort": "listing_timestamp",
  "order": "desc",
  "query": null,
  "limit": 10000,
  "max_mintings": {},
  "price": {},
  "weight_class": [],
  "highlight_type": [],
  "athlete_name": [],
  "tier": [],
  "set": [],
  "id": [],
};

const sets_requestOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(post_data_sets),
};

export default (req, res) => {
	return new Promise((resolve, reject) => {
		proxy.web(req, res, { 
      target: "https://market-api.ufcstrike.com/sets/", 
      changeOrigin: true ,
      
    }, (err) => {
			if (err) {
				return reject(err)
			}
			resolve()
		})
	})
}
