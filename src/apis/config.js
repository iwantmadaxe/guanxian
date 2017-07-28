let port = {};
if (process.env.NODE_ENV === 'production') {
	port = {
		route: 'http://106.14.182.134:8011',
		version: '/api/'
	};
} else {
	port = {
		route: 'http://localhost:8080',
		version: '/api/'
	};
}
export default port;
