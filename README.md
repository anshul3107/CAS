# Courier Booking Application 
**Live Demo**: http://54.157.170.56:3000/

- The web application is built using MERN Stack.
- React library is used to design responsive UI.
- NodeJS library Express is used to develop the ReSTful APIs.
- Database is hosted on MongoDB Atlas.

This web application provides Public API for user verification via email authentication.
Below is the endpoint for the API which can be invoked via GET request.
http://54.157.170.56:3000/public/api/email/verification?email=<email-address-to-be-verified>

The access to api secured for users who have the api_key.

This app uses AWS Simple Queue Service (SQS) as the messaging queue.
