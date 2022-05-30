run:
	docker-compose build && docker-compose up -d

clean:
	docker-compose kill
	docker-compose rm -f