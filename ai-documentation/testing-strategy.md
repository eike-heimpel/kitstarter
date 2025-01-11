# Testing Strategy

This document outlines the testing strategy for the KitStarter project, focusing on critical functionality and core services.

## Test Coverage

### 1. MongoDB Services
- **BaseService Tests** (`src/lib/server/mongodb/services/__tests__/BaseService.test.ts`)
  - Core CRUD operations
  - Pagination functionality
  - Error handling
  - Uses mocked MongoDB collections

- **UserService Tests** (`src/lib/server/mongodb/services/__tests__/UserService.test.ts`)
  - User-specific operations (findByEmail, findBySupabaseId)
  - Extends BaseService functionality
  - Handles null cases

### 2. API Endpoints
- **Users API Tests** (`src/routes/api/users/__tests__/+server.test.ts`)
  - GET endpoint with pagination
  - POST endpoint with validation
  - Error handling (400, 409, 500 cases)
  - Duplicate prevention
  - Request/Response handling

### 3. Authentication
- **Auth Action Tests** (`src/routes/auth/__tests__/+page.server.test.ts`)
  - Magic Link Authentication
    - Email validation
    - New user creation in MongoDB
    - Existing user handling
    - Supabase OTP integration
  - Email/Password Signup
    - Input validation
    - Password requirements
    - User creation in both Supabase and MongoDB
    - Duplicate prevention
  - Email/Password Login
    - Input validation
    - Credential verification
    - Error handling
  - Redirect Handling
    - Success redirects to appropriate pages
    - Error cases with proper status codes
    - Form submission validation

### 4. Toast Notifications
- **Toast Store Tests** (`src/lib/components/__tests__/toastStore.test.ts`)
  - Toast creation and removal
  - Auto-removal functionality
  - Multiple toasts handling

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
We use Vitest's built-in coverage reporting with v8. The configuration in `vite.config.ts` includes:

```typescript
test: {
    coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        exclude: [
            'coverage/**',
            'dist/**',
            '**/*.d.ts',
            'test/**',
            '**/__tests__/**',
            '**/*.test.ts'
        ],
        thresholds: {
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80
        }
    }
}
```

Coverage reports are generated in:
- HTML: `coverage/index.html`
- LCOV: `coverage/lcov.info`

## Test Organization

Tests are organized following the same structure as the source code:
- Service tests are placed in `__tests__` directories next to the services
- API endpoint tests are placed in `__tests__` directories next to the endpoints
- Component tests are placed in `__tests__` directories next to the components
- Auth action tests are placed in `__tests__` directories next to the server actions

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
