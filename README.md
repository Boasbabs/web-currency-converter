# Web-based currency converter

A web-based currency converter, using a foreign exchange rate API as a source of truth for the conversion. 

Hosted on: [adeyemi.currency_converter.surge.sh](http://adeyemi.currency_converter.surge.sh)

By [Adeyemi Babalola](mailto:babalolasimeon@gmail.com)


## Instructions

1. Navigate to [repo](https://github.com/Boasbabs/web-currency-converter)
2. Clone locally using
   `git clone git@github.com:Boasbabs/web-currency-converter.git`
3. Install dependencies using `yarn install`
4. Run tests using `yarn test`
5. Start your server using `yarn start`
6. Navigate to app in [browser](http://localhost:3000)
7. Enjoy!


## Discussion

I used the following technologies: 
- HTML, 
- CSS, 
- React,
- Jest, 
- React Testing Library.

I used [create-react-app](https://goo.gl/26jfy4)
to generate the scaffolding for this app.

## Requirements

- Ability to select the source and target currencies
- Ability to input the source amount
- Conversion rates must be pulled from a third-party API. We recommend using [https://ratesapi.io/](https://ratesapi.io/), but other APIs may be used as well, however the actual conversion calculation must be performed by your application (also do not use any third-party libraries for it).


## Bonuses!

- Bidirectional conversion (user can input either source or target amount)
- Make the app responsive
- Notification for error or bad network request
- Add UI tests; located `src/App.test.js`



