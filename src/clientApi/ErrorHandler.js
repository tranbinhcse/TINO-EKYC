import { Message } from 'ant-design-vue';
// Define an error handler function

// Function to handle errors
function ErrorHandler(error) {
    // If the error has a response, get the response status code
    const status = error.response ? error.response.status : null;
  
    // If the response status is between 400 and 499, display a user-friendly error message
    if (status && status >= 400 && status < 500) {
      switch (status) {
        case 400:
          Message.error('Bad Request');
          break;
        case 401:
          Message.error('Unauthorized');
          break;
        case 403:
          Message.error('Forbidden');
          break;
        case 404:
          Message.error('Not Found');
          break;
        default:
          Message.error('Client Error');
          break;
      }
      throw new Error(error.response.data.message || 'Client Error');
    }
  
    // If the response status is between 500 and 599, display a user-friendly error message
    if (status && status >= 500 && status < 600) {
      Message.error('Server Error');
      throw new Error(error.response.data.message || 'Server Error');
    }
  
    // If there is no response, or the response status is not between 400 and 599, display a generic error message
    Message.error('An error occurred');
    throw error;
  }

  export default ErrorHandler;