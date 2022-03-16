const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/********** GET / ***************
 *********** hoemepage **********/
 

const homepage = async (req, res) => {
  try {
    const limitNumber = 5; // limit number of recipes to be displayed on homepage
    const categories = await Category.find({}).limit(limitNumber); // query all categories
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber); // query latest recipes
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber); // query thai recipes  (category)
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    ); // query german recipes  (category)
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    ); // query chinese recipes  (category)

    const food = { latest, thai, american, chinese }; // combine all categories into one object
    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /about *********
 ********** GET About **********/
const about = async (req, res) => {
  try {
    res.render("about", { title: "Cooking Blog - About" });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /contact *******
 ********** GET Contact ********/
const contact = async (req, res) => {
  try {
    res.render("contact", { title: "Cooking Blog - Contact" });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /categories ***********
/********** GET / Categories **********/
const exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /recipe/:id *************
/********** GET / Recipe By Id **********/
const exploreRecipes = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", {
      title: "Cooking Blog - Recipe",
      recipe,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /categories/:id ***********
/********** GET / Categories By Id **********/
const exploreCategoriesById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};
/********** POST /search ***********
/********** POST / Search **********/
const searchRecipe = async (req, res) => {
  try {
    const searchTerm = req.body.searchTerm;
    const recipe = await Recipe.find({
      $text: {
        $search: searchTerm,
        $diacriticSensitive: true,
      },
    });
    res.render("search", {
      title: "Cooking Blog - Search",
      recipe,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /explore-latest ***********
/********** GET / Explore Latest **********/
const exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /explore-random ***********
/********** GET / Explore Random as JSON */
const exploreRandom = async (req, res) => {
  try {
    const count = await Recipe.find().countDocuments();
    const random = Math.floor(Math.random() * count);
    const recipe = await Recipe.findOne().skip(random);
    res.render("explore-random", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving recipes.",
    });
  }
};

/********** GET /submit-recipe ***********
/********** GET / Submit Recipe */
const submitRecipe = async (req, res) => {
  let infoErrorsObj = req.flash("infoErrors");
  let infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/********** POST /submit-recipe ***********
/********** POST / Submit Recipe */
const submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      req.flash("infoErrors", "No files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) {
          req.flash("infoErrors", "Image upload failed.");
          res.status(500).send(err);
        }
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();
    req.flash("infoSubmit", "Recipe has been added successfully!");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error.message);
    res.redirect("/submit-recipe");
  }
};

module.exports = {
  homepage,
  about,
  contact,
  exploreCategories,
  exploreRecipes,
  exploreCategoriesById,
  searchRecipe,
  exploreLatest,
  exploreRandom,
  submitRecipe,
  submitRecipeOnPost,
};


/***********Dummy Data Example ***********/

/**********insertDymmyCategoryData  **********/
// async function insertDymmyCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Thai",
//         img: "thai-food.jpg",
//       },
//       {
//         name: "American",
//         img: "american-food.jpg",
//       },
//       {
//         name: "Chinese",
//         img: "chinese-food.jpg",
//       },
//       {
//         name: "Mexican",
//         img: "mexican-food.jpg",
//       },
//       {
//         name: "Indian",
//         img: "indian-food.jpg",
//       },
//       {
//         name: "Spanish",
//         img: "spanish-food.jpg",
//       },
//     ]).then(() => {
//       console.log("Category data inserted");
//     });
//   } catch (error) {
//     console.log("err", + error.message);
//   }
// }
// insertDymmyCategoryData();


/**********insertDymmyRecipeData  **********/
// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         name: "Southern Fried Chicken",
//         description: `
//         To make the brine, toast the peppercorns in a large pan on a high heat for 1 minute, then add the rest of the brine ingredients and 400ml of cold water. Bring to the boil, then leave to cool, topping up with another 400ml of cold water.

//         Meanwhile, slash the chicken thighs a few times as deep as the bone, keeping the skin on for maximum flavour. Once the brine is cool, add all the chicken pieces, cover with clingfilm and leave in the fridge for at least 12 hours – I do this overnight.

//         After brining, remove the chicken to a bowl, discarding the brine, then pour over the buttermilk, cover with clingfilm and place in the fridge for a further 8 hours, so the chicken is super-tender.

//         When you’re ready to cook, preheat the oven to 190°C/375°F/gas 5.

//         Wash the sweet potatoes well, roll them in a little sea salt, place on a tray and bake for 30 minutes.

//         Meanwhile, make the pickle – toast the fennel seeds in a large pan for 1 minute, then remove from the heat. Pour in the vinegar, add the sugar and a good pinch of sea salt, then finely slice and add the cabbage. Place in the fridge, remembering to stir every now and then while you cook your chicken.

//         Source: https://www.jamieoliver.com/recipes/chicken-recipes/southern-fried-chicken/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "4 free-range chicken thighs , skin on, bone in",
//           "4 free-range chicken drumsticks",
//           "200 ml buttermilk",
//           "4 sweet potatoes",
//           "200 g plain flour",
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image: "southern-fried-chicken.jpg",
//       },
//       {
//         name: "Crab cakes",
//         description: `
//         Trim and finely chop the spring onions, and pick and finely chop the parsley. Beat the egg.
//         Combine the crabmeat, potatoes, spring onion, parsley, white pepper, cayenne and egg in a bowl with a little sea salt.

//         Refrigerate for 30 minutes, then shape into 6cm cakes.

//         Dust with flour and shallow-fry in oil over a medium heat for about 5 minutes each side or until golden-brown.

//         Serve with pinches of watercress and a dollop of tartare sauce.

//         Source: https://www.jamieoliver.com/recipes/seafood-recipes/crab-cakes/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "3 spring onions",
//           "½ a bunch of fresh flat-leaf parsley",
//           "1 large free-range egg",
//           "750 g cooked crabmeat , from sustainable sources",
//           "300 g mashed potatoes",
//           "1 teaspoon ground white pepper",
//           "1 teaspoon cayenne pepper",
//           "plain flour , for dusting",
//           "olive oil",
//           "watercress",
//           "tartare sauce",
//         ],
//         category: "American",
//         image: "crab-cakes.jpg",
//       },
//       {
//         name: "Stir-fried vegetables",
//         description: `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion, and mix with the garlic, chilli and spring onion.
//         Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl to the onion mixture.

//         Heat your wok until it’s really hot. Add a splash of oil – it should start to smoke – then the chilli and onion mix. Stir for just 2 seconds before adding the other mix. Flip and toss the vegetables in the wok if you can; if you can’t, don’t worry, just keep the vegetables moving with a wooden spoon, turning them over every few seconds so they all keep feeling the heat of the bottom of the wok. Season with sea salt and black pepper.

//         After a minute or two, the vegetables should have begun to soften. Add the soy sauce and 1 teaspoon of sesame oil and stir in. After about 30 seconds the vegetables should smell amazing! Tip on to a serving dish, sprinkle over some sesame seeds and tuck in

//         Source: https://www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 clove of garlic",
//           "1 fresh red chilli",
//           "3 spring onions",
//           "1 small red onion",
//           "1 handful of mangetout",
//           "a few shiitake mushrooms",
//         ],
//         category: "Chinese",
//         image: "stir-fried-vegetables.jpg",
//       },
//       {
//         name: "Spring rolls",
//         description: `
//         Put your mushrooms in a medium-sized bowl, cover with hot water and leave for 10 minutes, or until soft. Meanwhile, place the noodles in a large bowl, cover with boiling water and leave for 1 minute. Drain, rinse under cold water, then set aside.

//         For the filling, finely slice the cabbage and peel and julienne the carrot. Add these to a large bowl with the noodles.

//         Source: https://www.jamieoliver.com/recipes/vegetables-recipes/spring-rolls/`,

//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "40 g dried Asian mushrooms",
//           "50 g vermicelli noodles",
//           "200 g Chinese cabbage",
//           "1 carrot",
//           "3 spring onions",
//         ],
//         category: "Chinese",
//         image: "spring-rolls.jpg",
//       },
//       {
//         name: "Thai-Chinese-inspired pinch salad",
//         description: `
//         Peel and very finely chop the ginger and deseed and finely slice the chilli (deseed if you like). Toast the sesame seeds in a dry frying pan until lightly golden, then remove to a bowl.

//         Mix the prawns with the five-spice and ginger, finely grate in the lime zest and add a splash of sesame oil. Toss to coat, then leave to marinate.

//         Trim the lettuces, discarding any tatty outer leaves, then click the leaves apart. Pick out 12 nice-looking inner leaves (save the remaining lettuce for another recipe)

//         Source: https://www.jamieoliver.com/recipes/seafood-recipes/asian-pinch-salad/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "5 cm piece of ginger",
//           "1 fresh red chilli",
//           "25 g sesame seeds",
//           "24 raw peeled king prawns , from sustainable sources (defrost first, if using frozen)",
//         ],
//         category: "Chinese",
//         image: "thai-chinese-inspired-pinch-salad.jpg",
//       },
//       {
//         name: "Tom Daley's sweet & sour chicken",
//         description: `
//         Drain the juices from the tinned fruit into a bowl, add the soy and fish sauces, then whisk in 1 teaspoon of cornflour until smooth. Chop the pineapple and peaches into bite-sized chunks and put aside.

//         Pull off the chicken skin, lay it flat in a large, cold frying pan, place on a low heat and leave for a few minutes to render the fat, turning occasionally. Once golden, remove the crispy skin to a plate, adding a pinch of sea salt and five-spice.

//         Meanwhile, slice the chicken into 3cm chunks and place in a bowl with 1 heaped teaspoon of five-spice, a pinch of salt, 1 teaspoon of cornflour and half the lime juice. Peel, finely chop and add 1 clove of garlic, then toss to coat.

//         Source: https://www.jamieoliver.com/recipes/chicken-recipes/tom-daley-s-sweet-sour-chicken/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "x 227 g tin of pineapple in natural juice",
//           "1 x 213 g tin of peaches in natural juice",
//           "1 tablespoon low-salt soy sauce",
//           "1 tablespoon fish sauce",
//           "2 teaspoons cornflour",
//         ],
//         category: "Chinese",
//         image: "tom-daleys-sweet-sour-chicken.jpg",
//       },
//       {
//         name: "Chinese steak & tofu stew",
//         description: `
//         Get your prep done first, for smooth cooking. Chop the steak into 1cm chunks, trimming away and discarding any fat.

//         Peel and finely chop the garlic and ginger and slice the chilli. Trim the spring onions, finely slice the top green halves and put aside, then chop the whites into 2cm chunks. Peel the carrots and mooli or radishes, and chop to a similar size.

//         Place a large pan on a medium-high heat and toast the Szechuan peppercorns while it heats up. Tip into a pestle and mortar, leaving the pan on the heat.

//         Source: https://www.jamieoliver.com/recipes/stew-recipes/chinese-steak-tofu-stew/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "250g rump or sirloin steak",
//           "2 cloves of garlic",
//           "4cm piece of ginger",
//           "2 fresh red chilli",
//           "1 bunch of spring onions",
//         ],
//         category: "Chinese",
//         image: "chinese-steak-tofu-stew.jpg",
//       },
//       {
//         name: "Thai-style mussels",
//         description: `
//             Wash the mussels thoroughly, discarding any that aren’t tightly closed.

//             Trim and finely slice the spring onions, peel and finely slice the garlic. Pick and set aside the coriander leaves, then finely chop the stalks. Cut the lemongrass into 4 pieces, then finely slice the chilli.

//             In a wide saucepan, heat a little groundnut oil and soften the spring onion, garlic, coriander stalks, lemongrass and most of the red chilli for around 5 minutes.

//             Source: https://www.jamieoliver.com/recipes/seafood-recipes/thai-style-mussels/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 kg mussels , debearded, from sustainable sources",
//           "4 spring onions",
//           "2 cloves of garlic",
//           "½ a bunch of fresh coriander",
//         ],
//         category: "Thai",
//         image: "thai-style mussels.jpg",
//       },
//       {
//         name: "Thai green curry",
//         description: `
//             Preheat the oven to 180ºC/350ºF/gas 4.

//             Wash the squash, carefully cut it in half lengthways and remove the seeds, then cut into wedges. In a roasting tray, toss with 1 tablespoon of groundnut oil and a pinch of sea salt and black pepper, then roast for around 1 hour, or until tender and golden.

//             For the paste, toast the cumin seeds in a dry frying pan for 2 minutes, then tip into a food processor.

//             Source: https://www.jamieoliver.com/recipes/butternut-squash-recipes/thai-green-curry/  `,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 butternut squash (1.2kg)",
//           "groundnut oil",
//           "2x 400 g tins of light coconut milk",
//           "400 g leftover cooked greens, such as Brussels sprouts, Brussels tops, kale, cabbage, broccoli",
//         ],
//         category: "Thai",
//         image: "thai-green-curry.jpg",
//       },
//       {
//         name: "Thai red chicken soup",
//         description: `
//             Sit the chicken in a large, deep pan.

//             Carefully halve the squash lengthways, then cut into 3cm chunks, discarding the seeds.

//             Slice the coriander stalks, add to the pan with the squash, curry paste and coconut milk, then pour in 1 litre of water. Cover and simmer on a medium heat for 1 hour 20 minutes.

//             Use tongs to remove the chicken to a platter. Spoon any fat from the surface of the soup over the chicken, then sprinkle with half the coriander leaves.

//             Source: https://www.jamieoliver.com/recipes/chicken-recipes/thai-red-chicken-soup/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "1 x 1.6 kg whole free-range chicken",
//           "1 butternut squash (1.2kg)",
//           "1 bunch of fresh coriander (30g)",
//           "100 g Thai red curry paste",
//           "1 x 400 ml tin of light coconut milk",
//         ],
//         category: "Thai",
//         image: "thai-red-chicken-soup.jpg",
//       },
//       {
//         name: "Thai-inspired vegetable broth",
//         description: `
// Peel and crush the garlic, then peel and roughly chop the ginger. Trim the greens, finely shredding the cabbage, if using. Trim and finely slice the spring onions and chilli. Pick the herbs.

// Bash the lemongrass on a chopping board with a rolling pin until it breaks open, then add to a large saucepan along with the garlic, ginger and star anise.

// Place the pan over a high heat, then pour in the vegetable stock. Bring it just to the boil, then turn down very low and gently simmer for 30 minutes.

//             Source: https://www.jamieoliver.com/recipes/vegetables-recipes/asian-vegetable-broth/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "3 cloves of garlic",
//           "5cm piece of ginger",
//           "200 g mixed Asian greens , such as baby pak choi, choy sum, Chinese cabbage",
//           "2 spring onions",
//           "1 fresh red chilli",
//         ],
//         category: "Thai",
//         image: "thai-inspired vegetable broth.jpg",
//       },
//       {
//         name: "Key lime pie",
//         description: `
// Preheat the oven to 175ºC/gas 3. Lightly grease a 22cm metal or glass pie dish with a little of the butter.

// For the pie crust, blend the biscuits, sugar and remaining butter in a food processor until the mixture resembles breadcrumbs.

// Transfer to the pie dish and spread over the bottom and up the sides, firmly pressing down.

// Bake for 10 minutes, or until lightly browned. Remove from oven and place the dish on a wire rack to cool.

//             Source: https://www.jamieoliver.com/recipes/fruit-recipes/key-lime-pie/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "4 large free-range egg yolks",
//           "400 ml condensed milk",
//           "5 limes",
//           "200 ml double cream",
//         ],
//         category: "American",
//         image: "Key-lime-pie.jpg",
//       },
//       {
//         name: "Grilled lobster rolls",
//         description: `
// Remove the butter from the fridge and allow to soften.

// Preheat a griddle pan until really hot.

// Butter the rolls on both sides and grill on both sides until toasted and lightly charred (keep an eye on them so they don’t burn).

// Trim and dice the celery, chop the lobster meat and combine with the mayonnaise. Season with sea salt and black pepper to taste.

//             Source: https://www.jamieoliver.com/recipes/seafood-recipes/grilled-lobster-rolls/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "85 g butter",
//           "6 submarine rolls",
//           "500 g cooked lobster meat, from sustainable sources",
//           "1 stick of celery",
//         ],
//         category: "American",
//         image: "grilled-lobster.jpg",
//       },
//       {
//         name: "Veggie pad Thai",
//         description: `
// Cook the noodles according to the packet instructions, then drain and refresh under cold running water and toss with 1 teaspoon of sesame oil.

// Lightly toast the peanuts in a large non-stick frying pan on a medium heat until golden, then bash in a pestle and mortar until fine, and tip into a bowl.

// Peel the garlic and bash to a paste with the tofu, add 1 teaspoon of sesame oil, 1 tablespoon of soy, the tamarind paste and chilli sauce, then squeeze and muddle in half the lime juice.

//             Source: https://www.jamieoliver.com/recipes/vegetable-recipes/veggie-pad-thai/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "150 g rice noodles",
//           "sesame oil",
//           "20 g unsalted peanuts",
//           "2 cloves of garlic",
//         ],
//         category: "Thai",
//         image: "veggie-pad-thai.jpg",
//       },
//       {
//         name: "Chocolate & banoffee whoopie pies",
//         description: `
//         Preheat the oven to 170ºC/325ºF/gas 3 and line 2 baking sheets with greaseproof paper.

//         Combine the cocoa powder with a little warm water to form a paste, then add to a bowl with the remaining whoopie ingredients. Mix into a smooth, slightly stiff batter.

//         Spoon equal-sized blobs, 2cm apart, onto the baking sheets, then place in the hot oven for 8 minutes, or until risen and cooked through.

//             Source: https://www.jamieoliver.com/recipes/chocolate-recipes/chocolate-amp-banoffee-whoopie-pies/`,
//         email: "recipeemail@raddy.co.uk",
//         ingredients: [
//           "2 heaped tablespoons cocoa powder , plus extra for dusting",
//           "350 g self-raising flour",
//           "175 g sugar",
//           "200 ml milk",
//         ],
//         category: "American",
//         image: "chocolate-banoffee-whoopie-pies.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDymmyRecipeData();
