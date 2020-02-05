SELECT
  properties.*,
  reservations.*,
  avg(rating) AS average_rating
FROM
  reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  where reservations.guest_id = 1
  and reservations.end_date < now()::date
  group by reservations.id, properties.id
  order by reservations.start_date
  limit 10;

