const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
  password: '123'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
    SELECT * FROM users where $1 = email;
  `, [email])
    .then(res => res.rows[0])
    .catch(err => null);
  ;
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * FROM users WHERE $1 = id;
  `, [id])
    .then(res => res.rows[0])
    .catch(err => null);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users (name, email, password) 
  VALUES  ($1, $2, $3) RETURNING *;
  `, [user.name, user.email, user.password])
    .then(res => res.rows[0])
    .catch(err => null);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
  SELECT
    properties.*,
    reservations.*,
    avg(rating) AS average_rating
  FROM
    reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  and reservations.end_date < now()::date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2;`, [guest_id, limit])
    .then(res => res.rows)
    .catch(error => null);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT
    properties.*,
    avg(property_reviews.rating) AS average_rating
  FROM
    properties
    LEFT JOIN property_reviews ON property_id = properties.id
  `;

  //Add in WHERE clauses for each option if exists
  if(options.city){
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }

  // Using ${queryParams.length > 0 ? ' AND' : ' WHERE'} to determine whether each option is the first where clause or not
  if(options.owner_id){
    queryParams.push(`%${options.owner_id}`);
    queryString += `${queryParams.length > 0 ? ' AND' : ' WHERE'} owner_id = $${queryParams.length}`;
  }
  
  //Multiply by 100 to convert price to cents
  if(options.minimum_price_per_night){
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `${queryParams.length > 0 ? ' AND' : ' WHERE'}  $${queryParams.length} < properties.cost_per_night `;
  }
  
  if(options.maximum_price_per_night){
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `${queryParams.length > 0 ? ' AND' : ' WHERE'}  $${queryParams.length} > properties.cost_per_night `;
  }

  queryString += ` GROUP BY properties.id`;

  if(options.minimum_rating){
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` HAVING avg(rating) > $${queryParams.length}`;
  }
  console.log(queryString, queryParams)
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(error => null);
}
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool.query(`
    INSERT INTO properties (
      title,
      owner_id,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,     
      number_of_bathrooms,
      number_of_bedrooms)
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 
    )
    RETURNING *
  `, [property.title,
      property.owner_id, 
      property.description,
      property.thumbnail_photo_url, 
      property.cover_photo_url,
      property.cost_per_night, 
      property.street,
      property.city,
      property.province, 
      property.post_code,
      property.country,
      property.parking_spaces, 
      property.number_of_bathrooms,
      property.number_of_bedrooms,
    ])
    .then(res => res.rows)
    .catch(error => null);
}
exports.addProperty = addProperty;
