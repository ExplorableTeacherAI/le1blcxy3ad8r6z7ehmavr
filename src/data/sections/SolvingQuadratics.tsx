import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineClozeChoice,
    InlineTooltip,
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
        <div className="relative">
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
        </div>
    );
}

// ── Reactive Discriminant Display ─────────────────────────────────────────────
function ReactiveDiscriminant() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;
    const discriminant = b * b - 4 * a * c;

    const color = discriminant > 0 ? "#62D0AD" : discriminant === 0 ? "#F7B23B" : "#ef4444";
    return <span style={{ color, fontWeight: 600 }}>{discriminant.toFixed(1)}</span>;
}

function ReactiveRoots() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;

    if (a === 0) return <span>Not a quadratic equation</span>;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return <span style={{ color: '#ef4444' }}>No real solutions (discriminant is negative)</span>;
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        return <span style={{ color: '#F7B23B', fontWeight: 600 }}>x = {x.toFixed(2)} (one repeated root)</span>;
    } else {
        const x1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b + Math.sqrt(discriminant)) / (2 * a);
        return (
            <span style={{ color: '#AC8BF9', fontWeight: 600 }}>
                x = {Math.min(x1, x2).toFixed(2)} and x = {Math.max(x1, x2).toFixed(2)}
            </span>
        );
    }
}

function ReactiveRootCount() {
    const a = useVar('solveExampleA', 1) as number;
    const b = useVar('solveExampleB', -2) as number;
    const c = useVar('solveExampleC', -3) as number;

    if (a === 0) return <span>N/A</span>;

    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
        return <span style={{ color: '#62D0AD', fontWeight: 600 }}>Two distinct roots</span>;
    } else if (discriminant === 0) {
        return <span style={{ color: '#F7B23B', fontWeight: 600 }}>One repeated root</span>;
    } else {
        return <span style={{ color: '#ef4444', fontWeight: 600 }}>No real roots</span>;
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
                Solving a quadratic equation means finding the values of x that make y equal to zero.
                Graphically, these are the x-intercepts — the points where the parabola crosses the
                x-axis. The{" "}
                <InlineTooltip
                    id="tooltip-quadratic-formula"
                    tooltip="A formula that gives the solutions to any quadratic equation ax² + bx + c = 0."
                >
                    quadratic formula
                </InlineTooltip>
                {" "}is the most powerful tool for finding these solutions.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Quadratic formula
    <StackLayout key="layout-solve-formula-heading" maxWidth="xl">
        <Block id="solve-formula-heading" padding="sm">
            <EditableH3 id="h3-solve-formula-heading" blockId="solve-formula-heading">
                The Quadratic Formula
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-solve-formula" maxWidth="xl">
        <Block id="solve-formula" padding="md">
            <FormulaBlock
                latex="x = \frac{-\clr{b}{b} \pm \sqrt{\clr{b}{b}^2 - 4\clr{a}{a}\clr{c}{c}}}{2\clr{a}{a}}"
                colorMap={{ a: '#62D0AD', b: '#8E90F5', c: '#F7B23B' }}
            />
        </Block>
    </StackLayout>,

    // Discriminant heading
    <StackLayout key="layout-discriminant-heading" maxWidth="xl">
        <Block id="discriminant-heading" padding="sm">
            <EditableH3 id="h3-discriminant-heading" blockId="discriminant-heading">
                The Discriminant: The Key to Understanding Solutions
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-discriminant-explanation" maxWidth="xl">
        <Block id="discriminant-explanation" padding="sm">
            <EditableParagraph id="para-discriminant-explanation" blockId="discriminant-explanation">
                The expression under the square root, b² − 4ac, is called the{" "}
                <InlineTooltip
                    id="tooltip-discriminant"
                    tooltip="The discriminant tells us how many real solutions a quadratic equation has."
                >
                    discriminant
                </InlineTooltip>
                . It reveals how many solutions the equation has before you even calculate them.
                The discriminant is the key to understanding quadratic equations.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Discriminant formula
    <StackLayout key="layout-discriminant-formula" maxWidth="xl">
        <Block id="discriminant-formula" padding="md">
            <FormulaBlock
                latex="\Delta = \clr{b}{b}^2 - 4\clr{a}{a}\clr{c}{c}"
                colorMap={{ a: '#62D0AD', b: '#8E90F5', c: '#F7B23B' }}
            />
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
                    <strong>Discriminant (Δ):</strong> <ReactiveDiscriminant />
                    <br /><br />
                    <strong>Number of roots:</strong> <ReactiveRootCount />
                </EditableParagraph>
            </Block>
            <Block id="discriminant-roots" padding="sm">
                <EditableParagraph id="para-discriminant-roots" blockId="discriminant-roots">
                    <strong>Solutions:</strong> <ReactiveRoots />
                </EditableParagraph>
            </Block>
        </div>
        <Block id="discriminant-visualization" padding="sm" hasVisualization>
            <DiscriminantVisualization />
        </Block>
    </SplitLayout>,

    // Discriminant cases
    <StackLayout key="layout-discriminant-cases" maxWidth="xl">
        <Block id="discriminant-cases" padding="sm">
            <EditableParagraph id="para-discriminant-cases" blockId="discriminant-cases">
                <strong>Three cases to remember:</strong>
                <br /><br />
                • When <strong>Δ {">"} 0</strong> (positive): Two distinct real solutions. The parabola crosses the x-axis at two points.
                <br /><br />
                • When <strong>Δ = 0</strong>: One repeated solution. The parabola just touches the x-axis at its vertex.
                <br /><br />
                • When <strong>Δ {"<"} 0</strong> (negative): No real solutions. The parabola floats entirely above or below the x-axis.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Try to create each case
    <StackLayout key="layout-discriminant-challenge" maxWidth="xl">
        <Block id="discriminant-challenge" padding="sm">
            <EditableParagraph id="para-discriminant-challenge" blockId="discriminant-challenge">
                <strong>Challenge:</strong> Try adjusting the coefficients above to create each case.
                Can you make the discriminant exactly zero? Can you make the parabola float
                entirely above the x-axis with no solutions?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-solve-question" maxWidth="xl">
        <Block id="solve-question" padding="md">
            <EditableParagraph id="para-solve-question" blockId="solve-question">
                <strong>Check your understanding:</strong> If the discriminant b² − 4ac equals 16 (a positive number), the equation has{" "}
                <InlineFeedback
                    varName="answerDiscriminant"
                    correctValue="two"
                    position="terminal"
                    successMessage="— exactly! A positive discriminant means two distinct real solutions"
                    failureMessage="— not quite"
                    hint="Think about what happens when you take the square root of a positive number"
                    reviewBlockId="discriminant-cases"
                    reviewLabel="Review the discriminant cases"
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
