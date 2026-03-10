import { createAvatar } from '@dicebear/core';
import { initials, shapes, bottts } from '@dicebear/collection';

/**
 * Professional color palettes for avatars
 */
const COLOR_PALETTES = {
    corporate: ['1e40af', '7c3aed', '059669', 'dc2626', 'ea580c'],
    friendly: ['3b82f6', '8b5cf6', '10b981', 'f59e0b', 'ec4899'],
    modern: ['06b6d4', '8b5cf6', '14b8a6', 'f43f5e', 'f97316'],
    professional: ['1f2937', '374151', '4b5563', '6b7280', '9ca3af'],
};

/**
 * Generate safe, professional avatar
 * @param {Object} userData - User data (name, email)
 * @param {string} style - Avatar style ('initials', 'shapes', 'bottts')
 * @returns {string} Data URI string
 */
export const generateSafeAvatar = (userData, style = 'initials') => {
    const { name, email } = userData;

    // Use initials if name is available (most professional and safe)
    if (name && style === 'initials') {
        const avatar = createAvatar(initials, {
            seed: name,
            size: 200,
            backgroundColor: COLOR_PALETTES.friendly,
            fontWeight: 600,
        });
        return avatar.toDataUri();
    }

    // Geometric shapes (100% safe, abstract)
    if (style === 'shapes') {
        const avatar = createAvatar(shapes, {
            seed: email || name,
            size: 200,
        });
        return avatar.toDataUri();
    }

    // Cute robots (100% safe, fun)
    if (style === 'bottts') {
        const avatar = createAvatar(bottts, {
            seed: email || name,
            size: 200,
        });
        return avatar.toDataUri();
    }

    // Default fallback to initials
    const avatar = createAvatar(initials, {
        seed: name || email,
        size: 200,
        backgroundColor: COLOR_PALETTES.friendly,
        fontWeight: 600,
    });
    return avatar.toDataUri();
};

/**
 * Generate initials-only avatar (SAFEST option)
 * @param {string} name - User's full name
 * @param {string} palette - Color palette name
 * @returns {string} Data URI
 */
export const generateInitialsAvatar = (name, palette = 'friendly') => {
    const avatar = createAvatar(initials, {
        seed: name,
        size: 200,
        backgroundColor: COLOR_PALETTES[palette] || COLOR_PALETTES.friendly,
        fontWeight: 600,
    });

    return avatar.toDataUri();
};