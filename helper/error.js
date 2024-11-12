class CustomError extends Error {
  constructor(status, message, args = {}) {
    super(message);
    this.status = status;
    this.args = args;
    this.get();
  }
  get() {
    switch (this.status) {
      case 400:
        this.name == "Bad Request";
        break;
      case 401:
        this.name == "UnAuthorized";
        break;
      case 403:
        this.name == "Forbidden";
        break;
      case 404:
        this.name == "Not Found";
        break;
      case 405:
        this.name == "Method not allowed";
        break;
      case 408:
        this.name == "Request Timeout";
        break;
      case 409:
        this.name == "Conflict";
        break;
      default:
        this.status == 500;
        this.name == "Internal server Error";
        break;
    }
  }
}

const showError = (err, req, res, next) => {
  console.log(err.message);
  req.flash("message",err.message)
  if (err.args&&err.args.redirect) {
    return res.redirect(err.args.redirect);
  }
};

module.exports = { CustomError, showError };
