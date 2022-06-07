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

CREATE TABLE roles(
    id bigint primary key auto_increment,
    name varchar(100) not null unique,
    image varchar(255) null,
    route varchar(90) not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp not null
);

INSERT INTO
    roles(name, image, route, created_at, updated_at)
values
    (
        'RESTAURANTE',
        NULL,
        '/restaurant/orders/list',
        '2022-04-13',
        '2022-04-13'
    ),
    (
        'REPARTIDOR',
        NULL,
        '/delivery/orders/list',
        '2022-04-13',
        '2022-04-13'
    ),
    (
        'CLIENTE',
        NULL,
        '/client/products/list',
        '2022-04-13',
        '2022-04-13'
    );

CREATE TABLE user_has_roles(
    id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp default current_timestamp not null,
    updated_at timestamp default current_timestamp not null,
    foreign key (id_user) references users(id) on update cascade on delete cascade,
    foreign key (id_rol) references roles(id) on update cascade on delete cascade,
    primary key(id_user, id_rol)
)