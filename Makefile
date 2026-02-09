.PHONY: test coverage

test:
	cd backend && npm test
	cd frontend && npm test

coverage:
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage
