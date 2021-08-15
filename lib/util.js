module.exports = {
  testEmail:(email)=>{
    const expression = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return expression.test(email);
  },
  truncate: function (string, len) {
    if (string.length > len && string.length > 0) {
      let newString = string + "";
      newString = string.substr(0, len);
      newString = string.substr(0, newString.lastIndexOf(" "));
      newString = newString.length > 0 ? newString : string.substr(0, len);
      return newString + "...";
    }
    return string;
  },
}