import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineClozeChoice,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InlineFeedback } from "@/components/atoms/text/InlineFeedback";
import { getVariableInfo, numberPropsFromDefinition, spotColorPropsFromDefinition, choicePropsFromDefinition } from "../variables";
import { useVar } from "@/stores";

// ── Reactive Discriminant Visualization ───────────────────────────────────────
function DiscriminantVisualization() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;

    // Quadratic function
    const quadratic = (x: number) => a * x * x + b * x + c;

    // Calculate discriminant and roots
    const discriminant = b * b - 4 * a * c;
    const hasRealRoots = discriminant >= 0 && a !== 0;

    let x1: number | null = null;
    let x2: number | null = null;

    if (hasRealRoots && a !== 0) {
        x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    }

    // Vertex for reference
    const vertexX = a !== 0 ? -b / (2 * a) : 0;
    const vertexY = a !== 0 ? quadratic(vertexX) : c;

    // Determine color based on discriminant
    const curveColor = discriminant > 0 ? "#62D0AD" : discriminant === 0 ? "#F7B23B" : "#ef4444";

    return (
        <Cartesian2D
            height={380}
            viewBox={{ x: [-6, 6], y: [-8, 8] }}
            showGrid={true}
            plots={[
                // X-axis highlight
                {
                    type: "segment",
                    point1: [-6, 0],
                    point2: [6, 0],
                    color: "#64748b",
                    weight: 2,
                },
                // Main quadratic function
                ...(a !== 0 ? [{
                    type: "function" as const,
                    fn: quadratic,
                    color: curveColor,
                    weight: 3,
                }] : []),
                // Vertex point
                ...(a !== 0 ? [{
                    type: "point" as const,
                    x: vertexX,
                    y: vertexY,
                    color: "#8E90F5",
                }] : []),
                // X-intercepts (roots)
                ...(hasRealRoots && x1 !== null ? [{
                    type: "point" as const,
                    x: x1,
                    y: 0,
                    color: "#AC8BF9",
                }] : []),
                ...(hasRealRoots && x2 !== null && Math.abs(x1! - x2) > 0.01 ? [{
                    type: "point" as const,
                    x: x2,
                    y: 0,
                    color: "#AC8BF9",
                }] : []),
            ]}
        />
    );
}

// ── Reactive Displays ─────────────────────────────────────────────────────────
function ReactiveDiscriminant() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;
    const discriminant = b * b - 4 * a * c;

    const color = discriminant > 0 ? "#62D0AD" : discriminant === 0 ? "#F7B23B" : "#ef4444";
    return <span style={{ color, fontWeight: 600 }}>{discriminant.toFixed(0)}</span>;
}

function ReactiveRoots() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;

    if (a === 0) return <span>Not a quadratic</span>;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return <span style={{ color: '#ef4444' }}>No real solutions</span>;
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        return <span style={{ color: '#F7B23B', fontWeight: 600 }}>x = {x.toFixed(2)}</span>;
    } else {
        const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        return (
            <span style={{ color: '#AC8BF9', fontWeight: 600 }}>
                x = {Math.min(x1, x2).toFixed(2)}, {Math.max(x1, x2).toFixed(2)}
            </span>
        );
    }
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const solvingQuadraticsBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-solve-title" maxWidth="xl">
        <Block id="solve-title" padding="md">
            <EditableH2 id="h2-solve-title" blockId="solve-title">
                Solving Quadratic Equations
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-solve-intro" maxWidth="xl">
        <Block id="solve-intro" padding="sm">
            <EditableParagraph id="para-solve-intro" blockId="solve-intro">
                Solving ax² + bx + c = 0 means finding where the parabola crosses the x-axis.
                The quadratic formula gives the solutions directly.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Quadratic formula
    <StackLayout key="layout-solve-formula" maxWidth="xl">
        <Block id="solve-formula" padding="md">
            <FormulaBlock
                latex="x = \frac{-\clr{b}{b} \pm \sqrt{\clr{b}{b}^2 - 4\clr{a}{a}\clr{c}{c}}}{2\clr{a}{a}}"
                colorMap={{ a: '#62D0AD', b: '#8E90F5', c: '#F7B23B' }}
            />
        </Block>
    </StackLayout>,

    // Discriminant explanation
    <StackLayout key="layout-discriminant-explanation" maxWidth="xl">
        <Block id="discriminant-explanation" padding="sm">
            <EditableParagraph id="para-discriminant-explanation" blockId="discriminant-explanation">
                The discriminant Δ = b² − 4ac tells you how many solutions exist:
                positive → 2 roots, zero → 1 root, negative → no real roots.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-discriminant-explorer" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="discriminant-controls" padding="sm">
                <EditableParagraph id="para-discriminant-controls" blockId="discriminant-controls">
                    <InlineSpotColor varName="solveExampleA" {...spotColorPropsFromDefinition(getVariableInfo('solveExampleA'))}>
                        a
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="solveExampleA"
                        {...numberPropsFromDefinition(getVariableInfo('solveExampleA'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="solveExampleB" {...spotColorPropsFromDefinition(getVariableInfo('solveExampleB'))}>
                        b
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="solveExampleB"
                        {...numberPropsFromDefinition(getVariableInfo('solveExampleB'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="solveExampleC" {...spotColorPropsFromDefinition(getVariableInfo('solveExampleC'))}>
                        c
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="solveExampleC"
                        {...numberPropsFromDefinition(getVariableInfo('solveExampleC'))}
                    />
                </EditableParagraph>
            </Block>
            <Block id="discriminant-value" padding="sm">
                <EditableParagraph id="para-discriminant-value" blockId="discriminant-value">
                    <strong>Δ =</strong> <ReactiveDiscriminant />
                    <br />
                    <strong>Solutions:</strong> <ReactiveRoots />
                </EditableParagraph>
            </Block>
            <Block id="discriminant-note" padding="sm">
                <EditableParagraph id="para-discriminant-note" blockId="discriminant-note">
                    The curve color changes: green (2 roots), amber (1 root), red (no roots).
                </EditableParagraph>
            </Block>
        </div>
        <Block id="discriminant-visualization" padding="sm" hasVisualization>
            <DiscriminantVisualization />
        </Block>
    </SplitLayout>,

    // Assessment
    <StackLayout key="layout-solve-question" maxWidth="xl">
        <Block id="solve-question" padding="md">
            <EditableParagraph id="para-solve-question" blockId="solve-question">
                <strong>Quick check:</strong> If Δ = 16 (positive), the equation has{" "}
                <InlineFeedback
                    varName="answerDiscriminant"
                    correctValue="two"
                    position="terminal"
                    successMessage="— correct!"
                    failureMessage="— try again"
                    hint="Positive discriminant means the square root is real"
                >
                    <InlineClozeChoice
                        varName="answerDiscriminant"
                        correctAnswer="two"
                        options={["zero", "one", "two"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerDiscriminant'))}
                    />
                </InlineFeedback>
                {" "}real solution(s).
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
