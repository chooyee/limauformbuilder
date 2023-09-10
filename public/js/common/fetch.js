const fetchOptions = {
	method: 'GET', // HTTP method (GET, POST, etc.)
	headers: {
	  'Content-Type': 'application/json', // Request headers
	  // Add any other headers you need
	},
	// You can add more options like 'body' for POST requests, 'mode', 'credentials', etc.
  };

const fetchGet = (apiUrl, fetchOptions)=>{
  	return fetch(apiUrl, fetchOptions)
	.then((response) => {
		// Check if the response status is OK (200)
		if (!response.ok) {
			console.log(response.status);
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		// Parse the response JSON		
		return response.json();
	})
	.catch((error) => {
		console.error('Fetch error:', error);
		throw error; // Rethrow the error to propagate it to the caller
	});

};
  // Use the Fetch API to make a request with the specified options
