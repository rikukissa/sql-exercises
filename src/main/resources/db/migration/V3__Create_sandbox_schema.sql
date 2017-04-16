drop schema if exists sandbox cascade;
create schema sandbox;
alter table kurssit set schema sandbox;
alter table opiskelijat set schema sandbox;
alter table suoritukset set schema sandbox;
