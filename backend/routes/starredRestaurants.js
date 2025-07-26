const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params; // unpack id property from req.params using destructuring

  // Join the two data sets (with restaurantId as the foreign key and id as the primary key)
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find((restaurant) => {
        return restaurant.id === starredRestaurant.restaurantId;
      });

      return {
        id: restaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  const starredRestaurantFound = joinedStarredRestaurants.find((restaurant) => {
    return restaurant.id === id;
  });

  if (!starredRestaurantFound) {
    return res.sendStatus(404);
  }

  return res.json(starredRestaurantFound);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */

router.post("/", (req, res) => {
  const { body } = req; // destructure the body from the request
  const { name } = body; // destructure name from the body of the request

  const restaurantToStar = ALL_RESTAURANTS.find((restaurant) => {
    return restaurant.name === name;
  });

  if (!restaurantToStar) {
    return res.sendStatus(404);
  }

  const newId = uuidv4();
  const newStarredRestaurant = {
    id: newId,
    name: name,
  };

  STARRED_RESTAURANTS.push(newStarredRestaurant);
  res.sendStatus(201);
  return res.json(STARRED_RESTAURANTS);
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Remove restaurant from list of starred restaurants
  const newStarredRestaurantList = STARRED_RESTAURANTS.filter((restaurtant) => {
    return STARRED_RESTAURANTS.id !== id;
  });

  // Error handling if a user tries to delete a restaurant that's not found.
  if (STARRED_RESTAURANTS.length === newStarredRestaurantList.length) {
    res.status(404);
    return;
  }

  // Update starred restaurants list by reassigning it to the new one
  STARRED_RESTAURANTS = newStarredRestaurantList;

  // Return success status
  return res.sendStatus(202);
});
/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (res, req) => {
  const { id } = req.params;
  const { newComment } = req.body;

  // Find the relevant starred restaurant from the list
  const starredRestaurant = STARRED_RESTAURANTS.find((restaurant) => {
    return restaurant.id === id;
  });

  // Error handling if restaurant is not found
  if (!starredRestaurant) {
    res.sendStatus(404);
    return;
  }

  // Otherwise, update restaurant's comment with comment from request body
  starredRestaurant.comment = newComment;

  // Send success status code
  return res.sendStatus(200);
});

module.exports = router;
