##Ecrire des tests

###Jest
Jest est un framework de test JavaScript construit sur Jasmine et maintenu par Meta. Il a été conçu et construit par Christoph Nakazawa en mettant l'accent sur la simplicité et la prise en charge des grandes applications Web.
Il fonctionne avec les projets utilisant : Babel, TypeScript, Node, React, Angular, Vue ...etc

On peut écrire des tests comme ceci:

test('description de ce que je fais', () => {
    ***code à mettre***
    expect(quelquechose).matcher()
})
Un peu utiliser it à la place de test
=========================================
Un test unitaire teste un seule "statement".
On peut contenir plusieurs test dans un test d'intégration,
entouré par un **describe**.

describe('décrit où on est', ()=> {
    test('description de ce que je fais', () => {
    ***code à mettre***
    expect(quelquechose).matcher()
})

})

##Bibliothèque Jest
https://jestjs.io/fr/docs/getting-started

Les matcheurs:  https://jestjs.io/fr/docs/expect 
Les queries: https://testing-library.com/docs/queries/about/

##mocker 
jest.fn() peut mocker une fonction, elle renvoie la valeur 'undefined'
jest.fn() permet aussi de mocker une valeur
