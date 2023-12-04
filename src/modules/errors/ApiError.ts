class ApiError extends Error {
    statusCode: number;
  
    isOperational: boolean;
  
    override stack?: string;
  
    constructor(statusCode: number, message: string, isOperational = true, stack = '') {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
}

export default ApiError;


// class ApiError extends Error {
//   statusCode: number;
//   isOperational: boolean;

//   override stack?: string;

//   constructor(statusCode: number, message: string, isOperational = true, stack = '') {
//     super(message);

//     this.statusCode = statusCode;
//     this.isOperational = isOperational;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }

//     // Check if NODE_ENV is set to 'production'
//     if (process.env.NODE_ENV === 'production') {
//       // If in production, only show the message
//       this.message = `Error with status ${statusCode}`;
//     }
//   }
// }

// export default ApiError;
