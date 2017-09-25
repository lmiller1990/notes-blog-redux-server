const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const post = require('./post')
const user = require('./user')
const session = require('express-session')

const config = require('./config')
const app = express()

app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false
}));

app.use(express.static('public'))

app.set('port', process.env.PORT || 3002)

// const testdburl = 'mongodb://localhost:27017/posts-test-redux'
const testdburl = `mongodb://${config.DB_USER}:${config.DB_PASSWORD}@ds117093.mlab.com:17093/lachlan-blog`
mongoose.connect(testdburl, { useMongoClient: true })

const Post = mongoose.model('Post')
const User = mongoose.model('User')

app.use(bodyParser.json())
app.use(cors())

function requiresLogin(req, res, next) {
	console.log(req.session)
	if (req.session && req.session.userId) {
		return next();
	} else {
		var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		return next(err);
	}
}

app.post('/login', (req, res, next) => {
	console.log(req.body.data)
	User.authenticate(req.body.data.username, req.body.data.password, function (err, user) {
		if (err) {
			return res.send(401)
		} else {
			console.log(user._id)
			req.session.userId = user._id
			console.log(req.session)
			return res.send(200) 
		}

	})
})

app.post('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy(function(err) {
			if(err) {
				console.log('Error logging out')
				return next(err);
			} else {
				return res.send(200)
			}
		});
	}
})

app.get('/posts', (req, res) => {
	setTimeout(() => {
		Post.find({}, (err, posts) => {
			if (!err) {
				return res.json(
					posts
					.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				)
			}
		})
	}, 0)
})

app.get('/posts/:_id', requiresLogin, (req, res) => {
	setTimeout(() => {

		Post.find({ _id: req.params._id }, (err, post) => {
			if (!err) {
				return res.json(post[0])
			}
		})
	}, 0)
})

app.post('/posts/create', (req, res) => {
	setTimeout(() => {
		const title = req.body.data.title

		Post.create({ title: title }, (err, post) => {
			if (!err) {
				return res.json(post)
			} else {
				console.log('Err', err)
			}
		})
	}, 0)
})

app.post('/posts/:_id', (req, res) => {
	setTimeout(() => {

		Post.findByIdAndUpdate(req.params._id, {
			title: req.body.data.title,
			content: req.body.data.content	
		}, {new: true}, (err, post) => {
			if (!err) {
				return res.json(post)
			}
		})
	}, 00)
})

app.listen(app.get('port'), () => console.log(`Listening on ${app.get('port')} in ${process.env.NODE_ENV || 'development'}`))
