{
  name:{fr:string,en:string},
  content:{fr:string,en:string},  
  medias:[
    { link:string, label: string: url: string,type:enum(video,image,audio,soundcloud,vimeo) }
  ],  
  link:[
    { url:string, label:string,icon:string }
  ],  
  published: Date,
  created: Date,
  active: boolean,
  signature:string,
  creator:string,
}

