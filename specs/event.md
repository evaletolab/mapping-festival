{
  type:enum(Emission/Workshop/Masterclass/TableRonde/Concert/Performance/Nightclubbing),
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

