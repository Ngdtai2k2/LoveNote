CONTAINER=node_app_dev

migrate:
	docker exec -it $(CONTAINER) npx sequelize-cli db:migrate

rollback:
	docker exec -it $(CONTAINER) npx sequelize-cli db:migrate:undo:all

seed:
	docker exec -it $(CONTAINER) npx sequelize-cli db:seed:all

all:
	docker exec -it $(CONTAINER) sh -c "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
