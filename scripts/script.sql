-- Table definitions
create type cart_status as enum ('OPEN', 'ORDERED');
create type order_status as enum ('OPEN', 'ORDERED');

create table carts (
	id uuid default gen_random_uuid() primary key,
	user_id uuid not null,
	created_at date not null,
	updated_at date not null,
	status cart_status
)

create table cart_items (
	cart_id uuid references carts(id) on delete cascade,
	product_id uuid,
	count integer
)

create table orders (
	id uuid default gen_random_uuid() primary key,
	user_id uuid not null,
	cart_id uuid references carts(id) on delete cascade,
	payment json,
	delivery json,
	comments text,
	status order_status,
	total numeric(12, 2) not null
)

-- Test data
insert into carts (user_id, created_at, updated_at, status) values (gen_random_uuid(), CURRENT_DATE, CURRENT_DATE - 1, 'OPEN');
insert into carts (user_id, created_at, updated_at, status) values (gen_random_uuid(), CURRENT_DATE, CURRENT_DATE - 3, 'ORDERED');
insert into carts (user_id, created_at, updated_at, status) values (gen_random_uuid(), CURRENT_DATE, CURRENT_DATE - 5, 'ORDERED');
insert into carts (user_id, created_at, updated_at, status) values (gen_random_uuid(), CURRENT_DATE, CURRENT_DATE - 1, 'OPEN');

insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 1 from carts limit 1 offset 0;
insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 1 from carts limit 1 offset 0;
insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 1 from carts limit 1 offset 0;

insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 2 from carts limit 1 offset 1;
insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 2 from carts limit 1 offset 1;

insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 3 from carts limit 1 offset 2;

insert into cart_items (cart_id, product_id, count) select id, gen_random_uuid(), 4 from carts limit 1 offset 3;
