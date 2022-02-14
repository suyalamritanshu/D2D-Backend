## Backend for the D2D Android App

## Routes Involved

1) Driver Signup - api/authDriver/registerDriver 
2) Driver Login - api/authDriver/loginDriver 
3) Dealer Signup - api/authDriver/registerDealer 
4) Dealer Login - api/authDriver/registerDealer
5) Send OTP - api/authDriver/loginSendOTP
6) Verify OTP - api/authDriver/postOTP


7) Get data of the drivers that are available for a particular route - 

 /api/authDriver?fromCity1=Moradabad&fromCity2=Kanpur&fromCity3=Solan

8) Get data of the dealers that are available for a particular route (state and city) - 
 /api/authDealer?state=UP&city=Kanpur

9) Get all drivers - /api/authDriver/allDrivers


### Implementation - 

1) Clone the app.
2) Open the terminal and type yarn to add all the dependencies.
3) yarn dev to run the app.

