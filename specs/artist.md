# Index des artistes & pages par artiste
La page artiste présente la liste des artistes et les liens vers leur(s) œuvres respectives
- Références https://2016.mappingfestival.com/artists.html
# Model

``` json
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
```
