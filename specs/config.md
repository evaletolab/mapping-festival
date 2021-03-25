# Config - chargée au load
Elle détermine le context générale et particulier

|method|path|role|help|
|--|--|--|--|
|GET|/api/config|anonymous||
|POST|/api/config|admin||


```js
{
  meta:[
    {key:string,content:string}
  ],
  // bind menu items with 1..N layout
  menu:[    
    {layout:string,item:string,slug:string,weight:number,active:boolean,icon:string}
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
  layout:{
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
  },
  footer:{
    fr:string
    en:string
  }
  roles:{
    admin:[string],
    editor:[string]
  }
}
```
