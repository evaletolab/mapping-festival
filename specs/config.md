# Config - chargée au load
Elle détermine le context générale et particulier

```sh
/api/config 
GET|PUT
```

```js
{
  meta:[
    {key:string,content:string}
  ],
  menu:[
    {item:string,slug:string,weight:number,active:boolean,layout:string,icon:string}
  ],
  i18n:{
    fr:{key:string,label:string},
    en:{key:string,label:string},
  },
  // dynamic version
  layout:[
    {slug:string,css:string,title:string,meta:string,},    
  ],
  // static version
  {
    home:{
      css:string,
      title:string,
      meta:[
        {key:string,content:string}
      ],
      assets:[//...]
    },
    artist:{
      // ...
    }
    calendar:{
      // ...
    },
    event:{
      // ...
    },
    singleton:{
    }

  footer:{
    fr:string
    en:string
  }

}
```
