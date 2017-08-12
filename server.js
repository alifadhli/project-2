var express = require('express')
var db = require('./models')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars')
var multer = require('multer')
var expjwt = require('express-jwt')
var jwt = require('jsonwebtoken')



var upload = multer();

db.sequelize.sync()


var app = express()

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(expjwt({
	secret: 'shhhhh',
	getToken: function fromHeaderOrQuerystring (req) {
	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	        return req.headers.authorization.split(' ')[1];
	    } else if (req.query && req.query.token) {
	      	return req.query.token;
	    }  
	    return null; 
	  }
}).unless({
	path: [
		'/',
	    '/addUser',
	    '/about.html',
	    '/login',
	    /.jpg$/,
	    /.png$/,
	    /.js$/,
	    /.css$/,
	    /.ico$/,
	    /.mp4$/,
	    /.ogv$/,
	    /.svg$/,
	    /.woff/,
	    '/index.html',
	    '/blog.html',
	    '/blog-post.html',
	    '/contacts.html',
	    '/submit_restaurant.html',
	    '/no-password.html'
	]
})) 

app.use(function (err, req, res, next) {
  if (err.inner.name === 'TokenExpiredError') {
    res.redirect('/');
  }
});

app.use('/', express.static(__dirname))

app.use(bodyParser.urlencoded({extended: false}))

app.post('/addRest', function (req, res) {
	//add data to db
	var body = req.body
	db.restaurant.create({
		name: body.name_contact, 
		lastname: body.lastname_contact,
		email: body.email_contact,
		phone: body.phone_contact,
		restaurant: body.restaurant,
		restaurantWeb: body.restaurant_web,
		restaurantCity: body.restaurant_city,
		restaurantZip: body.restaurant_postal_code,
		mobile: body.mobile
	})
	res.redirect('/')
})

app.post('/addUser', upload.any(), function(req, res) {
	var body = req.body
	db.user.create({
		name: body.firstName,
		lastname: body.lastName,
		email: body.email,
		password: body.password,
	}).then(function(data) {
		var token = jwt.sign({
			exp: Math.floor(Date.now() / 1000) + (60 * 60),
			user: data.id
		}, 'shhhhh');
		res.json(token)
	}
)})

app.post('/login', upload.any(), function(req, res) {
	var body = req.body
	console.log(body)
	db.user.find({
		where: { email: body.email }
	}).then(function(data) {
		if (data.password === body.password) {
			var token = jwt.sign({
				exp: Math.floor(Date.now() / 1000) + (60 * 60),
				user: data.id
			}, 'shhhhh');
			res.json(token)
		}
		else {
			res.redirect('/no-password.html')
		}
	})
})

app.get('/restaurant-list', function(req, res) {
	db.restaurant.findAll().then(function(data) {
		res.render('restaurant-list', {restaurants: data.map(function(x) {
			return {
				name: x.restaurant,
				city: x.restaurantCity
			}
		})})
	})
})



app.listen(process.env.PORT)


