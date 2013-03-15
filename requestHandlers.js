/**
 * New node file
 */
function login(res) {
  var body = '<html lang="en">'+
  	'<head>'+
  	'<title>Sign In &middot; prdxt</title>'+
  	'<meta name="viewport" content="width=device-width, initial-scale=1.0" />'+
  	'<link href="/bootstrap/css/bootstrap.css" rel="stylesheet" media="screen">'+
  	'<link href="/css/signin.css" rel="stylesheet" media="screen">'+
  	'</head>'+
  	'<body style="padding-top: 40px; background-color: #f5f5f5;">'+
  	'<div class="container">'+
  	'<form class="form-signin" action="/authenticate" method="post">'+
  	'<h2 class="form-signin-heading">prdxt</h2>'+
  	'<input type="text" class="input-block-level" placeholder="username">'+
  	'<input type="password" class="input-block-level" placeholder="password">'+
  	'<button class="btn btn-large btn-primary" type="submit">Login</button>'+
  	'</form>'+
  	'</div>'+
  	'<script src="/bootstrap/js/bootstrap.js"></script>'
  	'</body>'+
  	'</html>';
  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(body);
  res.end();
}

exports.login = login;
