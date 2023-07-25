class Post {
  constructor(id, photo, title, description, channel) {
    this.id = id;
    this.photo = photo;
    this.title = title;
    this.description = description;
    this.views = 0;
    this.channel = channel;
  }
}

module.exports = Post;
