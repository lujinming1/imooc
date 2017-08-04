var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MovieSchema = new Schema({
  title: String,
  flash: String
});

MovieSchema.pre('save', function(next){ next();})

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('title')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MovieSchema;
