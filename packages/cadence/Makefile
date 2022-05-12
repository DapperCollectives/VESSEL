test:
	go test -v ./...

test_emulator:
	OVERFLOW_ENV=emulator go test -v ./...

build-vessel-emulator:
	docker build . -t vessel-emulator -f Dockerfile.test
run-vessel-emulator:
	docker run -it -p 8888:8888 -p 8080:8080 -p 3569:3569 emulator-test:latest