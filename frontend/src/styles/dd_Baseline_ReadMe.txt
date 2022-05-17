  /*                                         */
  /*                                         */
  /*                                         */
  /*    css baseline grid – d.delcourt 2021  */
  /*            online@delcourt.ch           */
  /*                                         */
  /*                                         */
  /*    v0.7                                 */



Read me
Baseline cheatsheet



----------------------------------------------------
	Contenu général

----------------------------------------------------


Un article doit être dans une

class=“spiegel” 

qui gère les marges, colonnes et gouttières

Le spiegel, miroir typographique, a 8 colonnes.



----------------------------------------------------
	Espacements

----------------------------------------------------

Les unités de base concernant l'espacement sont:

--line-height     (pas de grille verticale)
--gutter-width    (gouttière horizontale, utilisable aussi pour le padding)
--x-height        (hauteur de x de la typo utilisée)




Classes de base

h1
.h1-sub

h2
h3
h4
h5

p


.item
.légende

----------------------------------------------------
	N’importe quel div ou p a les shorthands:
----------------------------------------------------


.margin-top1    (espacement supérieur en terme de nombre de *ligne de texte*)
.margin-top2 ...
.margin-top8

.width1         (largeur en terme de nombre de *colonnes de texte*)
.width2 ...
.width7
.fullwidth

.height1        (espacement supérieur en terme de nombre de *lignes de texte*)
.height2
.height…20

.indent1 	(marge gauche, en terme de nombre de *colonnes de texte*)
.indent2 ...
.indent7


Ainsi que:

.align-left
.align-right
.align-center
.justify

.vcenter 	(alignement vertical)
.vhcenter (alignement vertical et horizontal)


****** Note: si la class "height" manque sur une image, 
	     le système part en sucette!



----------------------------------------------------
Sub-classes images

----------------------------------------------------


.image
	.fullwidth
	.align-left
	.align-right
  .shift-left



















