Wrapper = function() {}

Wrapper.prototype.extendWith = function(data) {
  for(field in data) {
    this[field] = data[field]
  }
}
