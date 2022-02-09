const response = (statusCode, body, contentType) => {
	return {
	  headers: { 
		'Content-Type': contentType || 'application/json',
		"Access-Control-Allow-Origin" : "*"
	  },
	  statusCode,
	  body: JSON.stringify(body)  
	};
  } 
  
  module.exports = response;