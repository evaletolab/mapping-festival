  /*                                         */
  /*                                         */
  /*                                         */
  /*    css baseline grid – d.delcourt 2021  */
  /*            online@delcourt.ch           */
  /*                                         */
  /*                                         */
  /*    v0.6                                 */



Read me
Baseline cheatsheet



----------------------------------------------------
	Contenu général

----------------------------------------------------


Un article doit être dans une

class=“spiegel” 

qui gère les marges, colonnes et gouttières



----------------------------------------------------
	Espacements

----------------------------------------------------

Les unités de base concernant l'espacement sont:

.line-height     (pas de grille verticale)
.gutter-width    (gouttière horizontale, utilisable aussi pour le padding)



----------------------------------------------------
	N’importe quel div a les shorthands

----------------------------------------------------


.margin-top1    (espacement supérieur en terme de nombre de *ligne de texte*)
.margin-top2
.margin-top…8

.width1         (largeur en terme de nombre de *colonnes de texte*)
.width2
.width…n

.height1        (espacement supérieur en terme de nombre de *lignes de texte*)
.height2
.height…n

.indent1 	 (marge gauche, en terme de nombre de *colonnes de texte*)
.indent2
.indent…7


Ainsi que:

.align-left
.align-right
.align-center
.justify

.vcenter


      ****** Note: si la variable .height manque sur une image, 
	     le système part en sucette! Mais rien de grave.



----------------------------------------------------
Sub-classes images

----------------------------------------------------


.image
	.fullwidth
	.align-left
	.align-right



















