
Un agenda/calendrier dynamique
- L’agenda doit être structuré sur la base d’une ligne temporelle
- L’agenda doit contenir des filtres (typologie, date, artiste, etc.)
- L’agenda doit s’aligner et présenter les œuvres/events du jour dès que le festival a
commencé et jusqu’à ce qu’il soit terminé
- Référence: https://2017.mappingfestival.com/program.html

{
  published: Date,
  created: Date,
  active: boolean,
  signature:string,
  creator:string,
  title:{fr:string,en:string},
  header:{fr:string,en:string},
  content:{fr:string,en:string},  
  attached:[
    { url:string, label: string: image: string }
  ]  
}

