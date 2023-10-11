const ingredientDataMapper = require('../models/ingredientDataMapper');
const cocktailDataMapper = require('../models/cocktailDataMapper');
const userDataMapper = require('../models/userDataMapper');
const bcrypt = require('bcrypt');
const sendConfirmationMail = require ("../services/mailService");
let currentRoute = "";

const userController = {
  async signUpAndRedirect (req, res, next){
    const newUser = req.body;
    newUser.roleId = 2;
    if(newUser.password === newUser.confirmation){
      newUser.password = await bcrypt.hash(newUser.password, parseInt(process.env.SALT));
      const { error,result } = await userDataMapper.addOneUser(newUser);
      if (error) {
        res.status(400).json(error);
      } else {
        sendConfirmationMail(newUser.email,newUser.firstname)
        res.status(200).json("Inscription validée ! vous pouvez maintenant vous connecter");
      }
    }
  },
  async sendingMailConfirmation (req,res){
    const {email, firstname} = req.body
    res.status(200).json(true);
  },

  async logInAndRedirect(req, res, next){
    const { email, password } = req.body;
    const { error, result } = await userDataMapper.getUserByEmail(email);
    if (error) {
      res.status(400).json(error);
    }
    else {
      const correctPassword = await bcrypt.compare(password, result.password);
      if(correctPassword){
        delete result.password;
        req.session.user = result;
        console.log(req.session.user)
        res.status(200).json("Vous êtes maintenant connecté !");
      }
      else {
        res.status(400).json("Mot de passe incorrect.");
      }
    }
  },

  async getProfilePage (req, res) {
    const userInfo = req.session.user;
    currentRoute = "profile";
    res.render('profilePage', {userInfo, currentRoute});
  },

  async logOutAndRedirect(req, res){
    req.session.user = null;
    res.redirect('/')
  },

  async renderFavouritesPages(req, res){
    const userId = req.session.user.id;
    const favourites = await userDataMapper.getFavourites(userId);
    currentRoute = 'favourites';
    res.render('favouritesPage', {favourites, currentRoute});
  },

  async getNewCocktailpage(req,res){
    const ingredients = await ingredientDataMapper.getAllIngredients();
    currentRoute = "newCocktail";
    res.render('newCocktail', {ingredients, currentRoute});
  },

  async addNewCocktail(req, res){
    const { name, instruction } = req.body;
    const userId = req.session.user.id;
    const cocktailResult = await cocktailDataMapper.addOneCocktailByUser(name, instruction, userId);
    const cocktailId = cocktailResult[0].id;
    console.log(req.body);
    const { ingredientId, quantity } = req.body;
    ingredientId.forEach(async (givenIngredient, index) => {
      let givenQuantity = quantity[index];
      const ingredientResult = await ingredientDataMapper.addIngredientToCocktail(cocktailId, givenIngredient, givenQuantity);
    });
    res.json('Le cocktail a bien été ajouté !');
  },

  async renderUserCocktailsPage(req, res){
    const userId = req.session.user.id;
    const userCocktails = await userDataMapper.getUserCocktails(userId);
    const currentRoute = 'usercocktails';
    res.render('userCocktailsPage', {userCocktails, currentRoute});
  },

  async getAllIngredients(req, res){
    const ingredients = await ingredientDataMapper.getAllIngredients();
    res.json(ingredients);
  },

  async updateProfile(req, res) {
    const userId = req.session.user.id;
    const parameters = req.body;
    const userInfo = await userDataMapper.updateUser(parameters, userId);
    res.header('Cache-Control', 'no-cache');
    res.json(userInfo);
  },

  async deleteProfile(req,res){
    const userId = req.session.user.id;
    const deletedProfile = await userDataMapper.deleteUser(userId);
    res.redirect('/');
  }
}

module.exports = userController;
