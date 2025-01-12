# Testing Strategy

This document outlines the testing strategy for the KitStarter project, focusing on critical functionality and core services.

## Test Coverage

### 1. Server-Side Testing
- MongoDB services and database interactions
- API endpoints and server routes
- Authentication flows and user management
- Error handling and edge cases
- Request/Response handling

### 2. Client-Side Testing
- Svelte stores and state management
- Component functionality
- Form validation and submission
- User interactions and events
- Error states and loading states

## Test Setup

### MongoDB Mocking
We use a centralized test setup file (`src/test/setup.ts`) that provides a type-safe mock collection factory:
```typescript
export function createMockCollection<T = any>(): Collection<T> {
    return {
        findOne: vi.fn(),
        find: vi.fn(() => ({
            skip: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            toArray: vi.fn()
        })),
        countDocuments: vi.fn(),
        insertOne: vi.fn(),
        findOneAndUpdate: vi.fn(),
        deleteOne: vi.fn()
    };
}
```

This mock collection:
- Implements the MongoDB Collection interface
- Provides chainable methods for pagination (skip, limit)
- Returns mock functions that can be spied on and have their returns customized
- Supports generic types for type safety

### Form Data Handling
For testing form submissions, we create proper Request objects with URLSearchParams:
```typescript
const createMockRequest = (email?: string, password?: string) => {
    return new Request('http://localhost', {
        method: 'POST',
        body: new URLSearchParams({
            email: email || '',
            password: password || ''
        }).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
};
```

### Date and ObjectId Handling
For API tests, we include a helper function to handle date and ObjectId serialization:
```typescript
function convertDatesToISOStrings(obj: any): any {
    // Converts dates to ISO strings and ObjectIds to strings
    // Used for comparing API responses
}
```

### Redirect Testing
For testing redirects in SvelteKit actions:
```typescript
const result = await actions.login({ /* ... */ });

// Verify it's a redirect response
expect(result).toBeInstanceOf(Response);
expect((result as Response).status).toBe(303);
expect((result as Response).headers.get('Location')).toBe('/private');
```

This approach:
- Treats redirects as normal responses (which they are)
- Verifies both the status code and redirect location
- Is more explicit and easier to understand
- Follows SvelteKit's redirect pattern

## Running Tests

```bash
# Run all tests
npm run test:unit

# Run specific test file
npm run test:unit src/lib/server/mongodb/services/__tests__/BaseService.test.ts

# Run tests with coverage
npm run test:coverage
```

### Coverage Configuration
We use Vitest's built-in coverage reporting with v8. The configuration excludes:

- Build artifacts (coverage/, dist/, .vercel/, .svelte-kit/)
- Test files (test/, src/test/, **/__tests__/**, **/*.test.ts)
- Type definitions and re-exports (**/*.d.ts, **/types.ts, **/index.ts)
- Svelte components (better tested with e2e/component tests)
- Route configuration files (+layout.{ts,js}, +page.{ts,js})
- Configuration files (*.config.{js,ts})
- Environment setup (src/app.d.ts, src/hooks.server.ts)

Coverage thresholds are set to 80% for:
- Lines
- Functions
- Branches
- Statements

Coverage reports are generated in:
- HTML: `coverage/index.html`
- LCOV: `coverage/lcov.info`

## Test Organization

Tests are organized following the same structure as the source code:
- Tests are placed in `__tests__` directories next to the files they test
- Each test file follows the naming convention `*.test.ts`
- Test files mirror the structure of the source code they test

## Best Practices

1. **Mocking**
   - Mock external dependencies (MongoDB, Supabase)
   - Use vi.mock() for module-level mocking
   - Clear mocks between tests using beforeEach
   - Mock environment variables when needed (e.g., PUBLIC_SITE_URL)

2. **Error Handling**
   - Test both success and error cases
   - Verify error status codes and messages
   - Use try/catch blocks for testing error scenarios
   - Test validation errors and business logic errors separately

3. **Data Consistency**
   - Use type-safe mock data
   - Handle date and ObjectId serialization
   - Maintain consistent test data structure
   - Use proper Request/Response objects

4. **Test Independence**
   - Each test should be independent
   - Clear mocks and reset state between tests
   - Avoid test interdependence
   - Reset environment variables after tests

5. **Form Testing**
   - Create proper Request objects with correct headers
   - Test form validation thoroughly
   - Handle different content types appropriately
   - Test both valid and invalid form submissions

## Future Improvements

1. Consider adding:
   - Performance tests
   - Load testing
   - E2E tests for critical paths

2. Improve coverage for:
   - Edge cases
   - Component interactions
   - Real-time updates
   - WebSocket connections (if added)

3. Additional test scenarios:
   - Session handling
   - Rate limiting
   - API versioning
   - Cache invalidation
