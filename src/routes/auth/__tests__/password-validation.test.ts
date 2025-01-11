import { describe, it, expect } from 'vitest';

function validatePassword(pass: string) {
    const errors = [];
    if (pass.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pass)) errors.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) errors.push('One special character');
    return errors;
}

describe('Password Validation', () => {
    it('should validate minimum length', () => {
        expect(validatePassword('short')).toContain('At least 8 characters');
        expect(validatePassword('longenough')).not.toContain('At least 8 characters');
    });

    it('should validate uppercase letter requirement', () => {
        expect(validatePassword('nouppercasehere123!')).toContain('One uppercase letter');
        expect(validatePassword('Uppercasehere123!')).not.toContain('One uppercase letter');
    });

    it('should validate lowercase letter requirement', () => {
        expect(validatePassword('NOLOWERCASEHERE123!')).toContain('One lowercase letter');
        expect(validatePassword('Lowercasehere123!')).not.toContain('One lowercase letter');
    });

    it('should validate number requirement', () => {
        expect(validatePassword('NoNumbersHere!')).toContain('One number');
        expect(validatePassword('Numbers123Here!')).not.toContain('One number');
    });

    it('should validate special character requirement', () => {
        expect(validatePassword('NoSpecialChars123')).toContain('One special character');
        expect(validatePassword('SpecialChars123!')).not.toContain('One special character');
    });

    it('should validate a fully compliant password', () => {
        const validPassword = 'ValidP@ssw0rd';
        expect(validatePassword(validPassword)).toHaveLength(0);
    });

    it('should return multiple errors for non-compliant password', () => {
        const invalidPassword = 'weak';
        const errors = validatePassword(invalidPassword);
        expect(errors).toContain('At least 8 characters');
        expect(errors).toContain('One uppercase letter');
        expect(errors).toContain('One number');
        expect(errors).toContain('One special character');
    });

    it('should handle empty password', () => {
        const errors = validatePassword('');
        expect(errors).toHaveLength(5);
    });

    it('should handle password with spaces', () => {
        const errors = validatePassword('Valid P@ssw0rd');
        expect(errors).toHaveLength(0);
    });
}); 