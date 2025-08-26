-#means heading and ## means subheading

# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## ProfileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password //Forgot password API

## ConnectionRequestRouter
<!-- 
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId -->
-POST /request/send/:status/:userId
-POST / request/review/:status/:requestId
<!-- 
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId -->

## userRouter
- GET /user/requests
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform

- status: ignore, interested, accepted, rejected
