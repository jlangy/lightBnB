SELECT
  properties.*,
  avg(rating) AS average_rating
FROM
  properties
  JOIN property_reviews ON property_id = properties.id
WHERE
  properties.city LIKE '%ancouver%'
GROUP BY
  properties.id
HAVING
  avg(rating) >= 4
LIMIT 10;

