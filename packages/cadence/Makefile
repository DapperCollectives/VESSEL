.PHONY: test
test:
	go test -v ./...

.PHONY: test-emulator
test-emulator:
	OVERFLOW_ENV=emulator go test -v ./...

.PHONY: build-vessel-emulator
build-vessel-emulator:
	docker build . -t vessel-emulator -f Dockerfile.emulator

.PHONY: run-vessel-emulator
run-vessel-emulator:
	docker run -it -p 8888:8888 -p 8080:8080 -p 3569:3569 vessel-emulator:latest

.PHONY: vessel-emulator
vessel-emulator: build-vessel-emulator run-vessel-emulator