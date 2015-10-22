Wrapper = function() {
  this.wrap = function(data) {
    for(field in data) {
      this[field] = data[field]
    }
  }
}
