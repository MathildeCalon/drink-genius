let mainContainer = document.getElementById("profile-main-container");
let startParameters = document.getElementById("profile-main-container").innerHTML;


/**************** PARAMETRES  ****************/
// ECOUTE SUR LE BOUTON PARAMETRE ET AFFICHE LES DONNEES
let accountParametersButton = document.getElementById("parameters-link");
accountParametersButton.addEventListener('click', function(){
    mainContainer.innerHTML = startParameters;
})


/**************** FAVORIS  ****************/
// RECUPERER LES COCKTAILS FAVORIS
let favouritesButton = document.getElementById("favourite-link");
let favouriteCocktails = [];

function fetchFavouriteCocktails (){
    return fetch('/profile/favourites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok){
            throw new Error('la requete a échoué')
        }
        return response.json();
    })
    .then(data => {
        favouriteCocktails = data;
    })
    .catch(error => {
        console.error('Erreur', error)
})};

// BOUCLER SUR LES COCKTAILS FAVORIS ET LES AFFICHER
function showFavouriteCocktails(){
    mainContainer.textContent = "";
    const title = document.createElement('h2')
    title.textContent = 'Vos cocktails préférés :'
    mainContainer.appendChild(title);
    if(favouriteCocktails.length > 0){
        const cocktailContainer = document.createElement('div');
        cocktailContainer.classList.add('cocktails');
        cocktailContainer.id = 'cocktails-container';

        favouriteCocktails.forEach(cocktail => {
            const likedCocktail = document.createElement('a');
            likedCocktail.classList.add('cocktails-container-item');
            likedCocktail.href = `/cocktail/${cocktail.id}`;
            const cocktailTitle = document.createElement('h3');
            cocktailTitle.classList.add('cocktail-title');
            cocktailTitle.textContent = cocktail.name;
            const cocktailPicture = document.createElement('div')
            cocktailPicture.classList.add('cocktail-img');
            cocktailPicture.style = `background-image: url('/images/${cocktail.picture} `;
            cocktailPicture.alt = `Image de ${cocktail.name}`;

            likedCocktail.appendChild(cocktailTitle);
            likedCocktail.appendChild(cocktailPicture);

            cocktailContainer.appendChild(likedCocktail);

            mainContainer.appendChild(cocktailContainer);
        })
    } else {
        const emptyMessage = document.createElement('div')
        emptyMessage.textContent = 'Rien à afficher ici !';
        mainContainer.appendChild(emptyMessage);
    }
}

// ECOUTE SUR LE BOUTON FAVORIS
favouritesButton.addEventListener('click', async function(){
    await fetchFavouriteCocktails();
    showFavouriteCocktails();
})


/***************** MES CREATIONS *********************/
let creationButton = document.getElementById('mycocktails-link');
let createdCocktails = [];

// RECUPERER LES COCKTAILS D'UN UTILISATEUR
function fetchCocktailsByUser (){
    return fetch('/profile/createdcocktail', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok){
            throw new Error('la requete a échoué')
        }
        return response.json();
    })
    .then(data => {
        createdCocktails = data;
    })
    .catch(error => {
        console.error('Erreur', error)
    })};

function showCreatedCocktails(){
    mainContainer.textContent = "";
    const title = document.createElement('h2')
    title.textContent = 'Vos créations :'
    mainContainer.appendChild(title);
    if(createdCocktails.length > 0){
        const cocktailContainer = document.createElement('div');
        cocktailContainer.classList.add('cocktails');
        cocktailContainer.id = 'cocktails-container';

        createdCocktails.forEach(cocktail => {
            const createdCocktail = document.createElement('a');
            createdCocktail.classList.add('cocktails-container-item');
            createdCocktail.href = `/cocktail/${cocktail.id}`;
            const cocktailTitle = document.createElement('h3');
            cocktailTitle.classList.add('cocktail-title');
            cocktailTitle.textContent = cocktail.name;
            const cocktailPicture = document.createElement('div')
            cocktailPicture.classList.add('cocktail-img');
            cocktailPicture.style = `background-image: url('/images/${cocktail.picture} `;
            cocktailPicture.alt = `Image de ${cocktail.name}`;

            createdCocktail.appendChild(cocktailTitle);
            createdCocktail.appendChild(cocktailPicture);

            cocktailContainer.appendChild(createdCocktail);

            mainContainer.appendChild(cocktailContainer);
        })
    } else {
        const emptyMessage = document.createElement('div')
        emptyMessage.textContent = 'Rien à afficher ici !';
        mainContainer.appendChild(emptyMessage);
    }
}

creationButton.addEventListener('click', async function(){
    await fetchCocktailsByUser();
    showCreatedCocktails();
}) 


/***************** NOUVEAU COCKTAIL *****************/
// AFFICHER LA PAGE POUR PROPOSER UN NOUVEAU COCKTAIL
let newCocktailButton = document.getElementById('newcocktail-link');
let ingredients = [];

// RECUPERER LES INGREDIENTS
function fetchIngredients (){
    return fetch('/ingredients', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok){
            throw new Error('la requete a échoué')
        }
        return response.json();
    })
    .then(data => {
        ingredients = data;
    })
    .catch(error => {
        console.error('Erreur', error)
    })};


function createForm(){
    // TITRE
    const title = document.createElement('h2');
    title.textContent = 'Votre cocktail :'
    mainContainer.appendChild(title);

    // FORMULAIRE
    const cocktailForm = document.createElement('form');
    cocktailForm.id = "new-cocktail-form";

    // TITRE DE LA RECETTE
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'name-input');
    const nameLabelText = document.createTextNode('Nom de la recette :');
    nameLabel.appendChild(nameLabelText);
    const nameInput = document.createElement('input');
    nameInput.classList.add('input');
    nameInput.id = 'name-input';
    nameInput.type = 'text';
    nameInput.name = 'cocktail_name';
    nameInput.placeholder = 'Nom du cocktail';

    // INSTRUCTIONS
    const instructionLabel = document.createElement('label');
    instructionLabel.setAttribute('for', 'instruction-input');
    const instructionLabelText = document.createTextNode('Recette :');
    instructionLabel.appendChild(instructionLabelText);
    const instructionInput = document.createElement('input');
    instructionInput.classList.add('input');
    instructionInput.id = 'instruction-input';
    instructionInput.type = 'text';
    instructionInput.name = 'cocktail_instruction';
    instructionInput.placeholder = 'Instructions du cocktail';

    // INGREDIENTS
    function createIngredientDropdown(){
    const ingredientLabel = document.createElement('label');
    ingredientLabel.setAttribute('for', 'ingredient-input');
    const ingredientLabelText = document.createTextNode('Ingrédient 1 :');
    ingredientLabel.appendChild(ingredientLabelText);
    const ingredientInput = document.createElement('select');
    ingredientInput.classList.add('dropdown-menu');
    ingredientInput.id = 'ingredient-1';
    ingredientInput.name = 'ingredient-1';

    ingredients.forEach(ingredient => {
        const newOption = document.createElement('option');
        newOption.value = ingredient.name;
        newOption.text = ingredient.name;
        ingredientInput.appendChild(newOption);
    })

    cocktailForm.appendChild(ingredientLabel)
    cocktailForm.appendChild(ingredientInput);
};

    createIngredientDropdown();

    // CREATION D'UN BOUTON "AJOUTER UN INGREDIENT" 
    const addIngredientButton = document.createElement('div');
    addIngredientButton.textContent = "Ajouter un ingrédient";
    addIngredientButton.classList.add('add-ingredient-button');
    addIngredientButton.addEventListener('click', function(){
        createIngredientDropdown();
    })


    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.id = 'new-cocktail-button'
    submitButton.textContent = 'Envoyer'

    cocktailForm.appendChild(nameLabel);
    cocktailForm.appendChild(nameInput);
    cocktailForm.appendChild(instructionLabel);
    cocktailForm.appendChild(instructionInput);
    cocktailForm.appendChild(addIngredientButton);
    cocktailForm.appendChild(submitButton);

    
    mainContainer.textContent = '';
    mainContainer.appendChild(cocktailForm);
};

newCocktailButton.addEventListener('click', async function(){
    await fetchIngredients();
    createForm();
});


/******* SOUMETTRE LES DONNEES DU NOUVEAU COCKTAIL *************/
let submitButton = document.getElementById('new-cocktail-button');
submitButton.addEventListener('click', function(event){
    event.preventDefault();
    const cocktailForm = getElementById('new-cocktail-form');
    console.log(cocktailForm);
/*     cocktailForm.forEach(input => { 
        
    })*/
})

