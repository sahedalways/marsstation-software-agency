export function validateField(
    name: string,
    value: string | boolean,
    rule?: { min: number; max: number }
): string {
    if (typeof value === 'boolean') {
        if (!value) {
            return 'You must agree to the Privacy Policy';
        }

        return '';
    }

    if (!value.trim()) {
        return `${name} is required`;
    }

    if (rule) {
        if (value.length < rule.min) {
            return `${name} must be at least ${rule.min} characters`;
        }

        if (value.length > rule.max) {
            return `${name} cannot exceed ${rule.max} characters`;
        }
    }

    if (name === 'E-mail') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            return 'Invalid email address';
        }
    }

    if (name === 'Phone') {
        const phoneRegex = /^\+?[0-9]{8,15}$/;

        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return 'Invalid phone number';
        }
    }

    return '';
}
