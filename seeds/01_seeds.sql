INSERT INTO users (name, email, PASSWORD)
  VALUES ('jon', 'jon@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('jon', 'jon@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('jon', 'jon@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES (16, 'house', 'big house', 'www.fake.url.com', 'www.fake.url.com', 5, 5, 5, 5, 'uruguay', 'uruguay st.', 'uruguay city', 'alberta', 'ggg555'), (17, 'hut', 'small house', 'www.fake.url.com', 'www.fake.url.com', 5, 5, 5, 5, 'canada', 'canada st.', 'canada city', 'alberta', 'ggg555'), (18, 'cave', 'big cave', 'www.fake.url.com', 'www.fake.url.com', 5, 5, 5, 5, 'america', 'america st.', 'america city', 'alberta', 'ggg555');

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES ('2020-01-01', '2021-01-01', 13, 16), ('2020-02-20', '2121-01-01', 14, 17), ('2020-03-11', '2221-01-01', 15, 18);

insert into property_reviews (
  guest_id,
  property_id,
  reservation_id,
  rating,
  message
) values 
(16, 13, 1, 1, 'bad'),
(17, 14, 2, 2, 'good'),
(18, 15, 3, 1, 'ugly');

