# Structure «Events/Œuvres»
- Un descriptif général
- Une localisation géographique
- Un tag de zone géographique pour filtrage alphanumérique [??]
- Un tag de typologie (Event [ Emission/Workshop/Masterclass/Table
Ronde/Concert/Performance/Nightclubbing ] — Œuvre)
- Une collection de médias à afficher sur la page liée
- Une date et heure (de début et de fin) vs. (de début et de durée)
- Un tarif
- Un nombre de participants
- Un descriptif de langue (ex. workshops in english)
- Un champ matériel à amener (workshops)
- Une zone «Notes/addendum/remarque» fourre tout pour les oublis

# Routes
|method|path|role|filters|
|--|--|--|--|
|GET|/api/event|anonymous| type=|
|POST|/api/event|admin,editor||
|PUT|/api/event/:id|admin,editor||
|DELETE|/api/event/:id|admin,editor||

# Model
* type == enum(Emission/Workshop/Masterclass/TableRonde/Concert/Performance/Nightclubbing)

```js
{
  type:string,
  title:{fr:string,en:string},
  header:{fr:string,en:string},
  content:{fr:string,en:string},  
  hardware:{fr:string,en:string},  
  notes:{fr:string,en:string},  
  year:number,
  when:[{
    start:Date,
    end:Date,
    duration: number,
    cancel: boolean
  }],
  price: number,
  limit: number,
  geo:{
    lng:number,
    lat:number,
    tag:string,
    street:string
    postalCode:string,
    city:string
  },
  medias:[
    { link:string, label: string: source: string,type:enum(video,image,audio,soundcloud,vimeo) }
  ],
  artists:[{
    name:string,
    slug:string
  }],
  published: Date,
  created: Date,
  active: boolean,
  signature:string,
  creator:string,
}
```
