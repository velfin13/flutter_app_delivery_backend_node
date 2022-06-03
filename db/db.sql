USE delivery;

CREATE TABLE users(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(180) NOT NULL UNIQUE,
    name VARCHAR(90) NOT NULL,
    lastname VARCHAR(90) NOT NULL,
    phone VARCHAR(90) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(90) NOT NULL,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp not null
);