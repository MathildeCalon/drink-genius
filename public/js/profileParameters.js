document.addEventListener("DOMContentLoaded", function () {

  /**************** PARAMETRES  ****************/

  // ECOUTE SUR LE BOUTON MODIFIER ET AFFICHE LE FORMULAIRE DE MODIFICATION
  const parametersModificationBtn = document.getElementById("parameters-modification-btn");
  const parametersForm = document.getElementById("parameters-form");
  const parametersList = document.getElementById("parameters-list");
  const fields = parametersForm.querySelectorAll("input");


  // ACTIVATION BOUTON SUBMIT
  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      parametersModificationBtn.removeAttribute("disabled");
    });
  });

  // SUBMIT MODIFICATIONS
  parametersModificationBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const updateForm = document.getElementById("parameters-form");
    await updateUserInfo(updateForm);
  });

  function updateUserInfo (userInfo){
    return fetch("/profile", {
      method: "PATCH",
      body: JSON.stringify(Object.fromEntries(new FormData(userInfo))),
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then(response => {
        if (!response.ok){
          throw new Error("la requete a échoué");
        }
        return response.json();
      })
      .then(data => {
          console.log('Données mises à jour : ', data);
          window.location.reload();
      })
      .catch(error => {
        console.error("Erreur", error);
      });}

  /**************** SUPPRIMER SON COMPTE ****************/
  const deleteButton = document.getElementById('delete-account-button');
  deleteButton.addEventListener('click', function(){
  });

});