const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	}
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
