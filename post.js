const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
