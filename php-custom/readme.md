
# Ultre Simple API REST for artist  

implements a route to add a event object to an flat file NoSQL database like.
expects a json encoded object of format: 
```js
{
  "name":{
    "fr":"bonjour",
    "en":"hello"
  },
  "content":{
    "fr":"le monde",
    "en":"world"
  },  
  "medias":[
    { 
      "label": "2021", 
      "url":"https://lh3.googleusercontent.com/eupqUd8o-yPZS-sNkLQ94ZLVvG5iFh96hMooyUoml94Om096vGsnEceNqcvfjQ5H76Y", 
      "type":"image" 
    }
  ],  
  "link":[
    { 
      "url":"https://karibou.ch/", 
      "label":"2021",
      "icon":"none" 
    }
  ],  
  "active": true,
  "signature":"oli",
  "creator":"olivier"
}
```

## install it

- install compose 2
- composer require rakibtg/sleekdb

## todo
- missing auth0 JWT 
- missing payload validator
- missing ... many 

## curl test
  php -S localhost:4000
  cd tests
  bash test.sh
