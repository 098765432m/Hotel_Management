namespace CustomError {
  // Lỗi Input người dùng
  export class ValidationError extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "Validation Error";
      this.statusCode = 400;
    }
  }
  export class AuthenticationError extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "Unauthorized Error";
      this.statusCode = 401;
    }
  }

  export class AuthorizationError extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "Forbidden Error";
      this.statusCode = 403;
    }
  }

  // Lỗi không tìm thấy tài nguyên
  export class NotFoundError extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "Not Found Error";
      this.statusCode = 404;
    }
  }

  // Lỗi hệ thống
  export class InternalServerError extends Error {
    statusCode: number;

    constructor(message: string) {
      super(message);
      this.name = "Internal Server Error";
      this.statusCode = 500;
    }
  }
}

export default CustomError;
