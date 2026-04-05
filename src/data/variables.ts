/**
 * Variables Configuration
 * =======================
 *
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 *
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 *
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /** Correct answer for cloze input validation */
    correctAnswer?: string;
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 QUADRATIC FUNCTIONS LESSON VARIABLES
 * =====================================================
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ─────────────────────────────────────────
    // SECTION 1: Introduction - Basketball Trajectory
    // ─────────────────────────────────────────
    launchAngle: {
        defaultValue: 55,
        type: 'number',
        label: 'Launch Angle',
        description: 'The angle at which the basketball is thrown',
        unit: '°',
        min: 30,
        max: 75,
        step: 1,
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // SECTION 2: Shape of a Parabola
    // ─────────────────────────────────────────
    basicParabolaX: {
        defaultValue: 2,
        type: 'number',
        label: 'X Value',
        description: 'X coordinate on the basic parabola y = x²',
        min: -4,
        max: 4,
        step: 0.5,
        color: '#8E90F5',
    },

    // ─────────────────────────────────────────
    // SECTION 3: Coefficients - How a, b, c affect the shape
    // ─────────────────────────────────────────
    coefficientA: {
        defaultValue: 1,
        type: 'number',
        label: 'Coefficient a',
        description: 'The coefficient that controls the width and direction of the parabola',
        min: -3,
        max: 3,
        step: 0.25,
        color: '#62D0AD',
    },
    coefficientB: {
        defaultValue: 0,
        type: 'number',
        label: 'Coefficient b',
        description: 'The coefficient that shifts the parabola horizontally',
        min: -4,
        max: 4,
        step: 0.5,
        color: '#8E90F5',
    },
    coefficientC: {
        defaultValue: 0,
        type: 'number',
        label: 'Coefficient c',
        description: 'The coefficient that shifts the parabola vertically (y-intercept)',
        min: -5,
        max: 5,
        step: 0.5,
        color: '#F7B23B',
    },

    // ─────────────────────────────────────────
    // SECTION 4: Vertex and Intercepts
    // ─────────────────────────────────────────
    vertexExampleA: {
        defaultValue: 1,
        type: 'number',
        label: 'Coefficient a for vertex example',
        description: 'Controls the shape in the vertex demonstration',
        min: -2,
        max: 2,
        step: 0.5,
        color: '#62D0AD',
    },
    vertexExampleH: {
        defaultValue: 2,
        type: 'number',
        label: 'Horizontal shift h',
        description: 'The x-coordinate of the vertex',
        min: -4,
        max: 4,
        step: 0.5,
        color: '#8E90F5',
    },
    vertexExampleK: {
        defaultValue: -1,
        type: 'number',
        label: 'Vertical shift k',
        description: 'The y-coordinate of the vertex',
        min: -4,
        max: 4,
        step: 0.5,
        color: '#F7B23B',
    },

    // ─────────────────────────────────────────
    // SECTION 5: Solving Quadratic Equations
    // ─────────────────────────────────────────
    solveExampleA: {
        defaultValue: 1,
        type: 'number',
        label: 'Coefficient a for solving',
        description: 'The a coefficient in the equation to solve',
        min: -2,
        max: 2,
        step: 0.5,
        color: '#62D0AD',
    },
    solveExampleB: {
        defaultValue: -2,
        type: 'number',
        label: 'Coefficient b for solving',
        description: 'The b coefficient in the equation to solve',
        min: -6,
        max: 6,
        step: 1,
        color: '#8E90F5',
    },
    solveExampleC: {
        defaultValue: -3,
        type: 'number',
        label: 'Coefficient c for solving',
        description: 'The c coefficient in the equation to solve',
        min: -6,
        max: 6,
        step: 1,
        color: '#F7B23B',
    },

    // ─────────────────────────────────────────
    // SECTION 6: Real-World Applications
    // ─────────────────────────────────────────
    projectileTime: {
        defaultValue: 1,
        type: 'number',
        label: 'Time',
        description: 'Time elapsed in projectile motion',
        unit: 's',
        min: 0,
        max: 4,
        step: 0.1,
        color: '#AC8BF9',
    },
    projectileVelocity: {
        defaultValue: 20,
        type: 'number',
        label: 'Initial Velocity',
        description: 'Initial velocity of the projectile',
        unit: 'm/s',
        min: 10,
        max: 30,
        step: 1,
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // ASSESSMENT VARIABLES
    // ─────────────────────────────────────────
    answerParabolaDirection: {
        defaultValue: '',
        type: 'select',
        label: 'Parabola Direction Answer',
        description: 'Student answer for direction when a is negative',
        placeholder: '???',
        correctAnswer: 'downward',
        options: ['upward', 'downward', 'left', 'right'],
        color: '#8E90F5',
    },
    answerYIntercept: {
        defaultValue: '',
        type: 'text',
        label: 'Y-Intercept Answer',
        description: 'Student answer for the y-intercept value',
        placeholder: '???',
        correctAnswer: '3',
        color: '#F7B23B',
    },
    answerVertexX: {
        defaultValue: '',
        type: 'text',
        label: 'Vertex X Answer',
        description: 'Student answer for vertex x-coordinate',
        placeholder: '???',
        correctAnswer: '2',
        color: '#8E90F5',
    },
    answerDiscriminant: {
        defaultValue: '',
        type: 'select',
        label: 'Discriminant Meaning Answer',
        description: 'Student answer for what discriminant tells us',
        placeholder: '???',
        correctAnswer: 'two',
        options: ['zero', 'one', 'two'],
        color: '#AC8BF9',
    },
    answerMaxHeight: {
        defaultValue: '',
        type: 'text',
        label: 'Maximum Height Answer',
        description: 'Student answer for max height in projectile problem',
        placeholder: '???',
        correctAnswer: '20',
        color: '#62D0AD',
    },

    // ─────────────────────────────────────────
    // LINKED HIGHLIGHT VARIABLES
    // ─────────────────────────────────────────
    activeHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Active Highlight',
        description: 'Currently highlighted element for linked highlighting',
        color: '#62D0AD',
        bgColor: 'rgba(98, 208, 173, 0.15)',
    },
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
