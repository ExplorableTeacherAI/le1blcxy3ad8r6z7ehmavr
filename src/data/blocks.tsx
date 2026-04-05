import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

// Import all sections
import { introductionBlocks } from "./sections/Introduction";
import { shapeOfParabolaBlocks } from "./sections/ShapeOfParabola";
import { coefficientsBlocks } from "./sections/Coefficients";
import { vertexAndInterceptsBlocks } from "./sections/VertexAndIntercepts";
import { solvingQuadraticsBlocks } from "./sections/SolvingQuadratics";
import { realWorldApplicationsBlocks } from "./sections/RealWorldApplications";

/**
 * ------------------------------------------------------------------
 * QUADRATIC FUNCTIONS LESSON
 * ------------------------------------------------------------------
 *
 * A comprehensive interactive lesson on quadratic functions for
 * secondary school students (ages 13-17).
 *
 * SECTIONS:
 * 1. Introduction - Basketball trajectory hook
 * 2. Shape of a Parabola - The basic y = x² curve
 * 3. Coefficients - How a, b, c transform the parabola
 * 4. Vertex and Intercepts - Finding key points
 * 5. Solving Quadratic Equations - The quadratic formula & discriminant
 * 6. Real-World Applications - Projectile motion
 */

export const blocks: ReactElement[] = [
    ...introductionBlocks,
    ...shapeOfParabolaBlocks,
    ...coefficientsBlocks,
    ...vertexAndInterceptsBlocks,
    ...solvingQuadraticsBlocks,
    ...realWorldApplicationsBlocks,
];
