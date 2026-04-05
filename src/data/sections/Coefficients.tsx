import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineTrigger,
    InlineClozeChoice,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InlineFeedback } from "@/components/atoms/text/InlineFeedback";
import { getVariableInfo, numberPropsFromDefinition, spotColorPropsFromDefinition, choicePropsFromDefinition } from "../variables";
import { useVar } from "@/stores";

// ── Reactive Coefficients Visualization ───────────────────────────────────────
function CoefficientsVisualization() {
    const a = useVar('coefficientA', 1) as number;
    const b = useVar('coefficientB', 0) as number;
    const c = useVar('coefficientC', 0) as number;

    // Calculate vertex position
    const vertexX = a !== 0 ? -b / (2 * a) : 0;
    const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;

    // Quadratic function
    const quadratic = (x: number) => a * x * x + b * x + c;

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-6, 6], y: [-8, 10] }}
                showGrid={true}
                plots={[
                    // Reference parabola y = x² (faded)
                    {
                        type: "function",
                        fn: (x) => x * x,
                        color: "#cbd5e1",
                        weight: 2,
                    },
                    // Main quadratic function
                    ...(a !== 0 ? [{
                        type: "function" as const,
                        fn: quadratic,
                        color: "#62D0AD",
                        weight: 3,
                    }] : []),
                    // Y-intercept point (where x = 0)
                    {
                        type: "point" as const,
                        x: 0,
                        y: c,
                        color: "#F7B23B",
                    },
                    // Vertex point
                    ...(a !== 0 ? [{
                        type: "point" as const,
                        x: vertexX,
                        y: vertexY,
                        color: "#ef4444",
                    }] : []),
                    // Axis of symmetry
                    ...(a !== 0 ? [{
                        type: "segment" as const,
                        point1: [vertexX, -8] as [number, number],
                        point2: [vertexX, 10] as [number, number],
                        color: "#94a3b8",
                        weight: 1,
                        style: "dashed" as const,
                    }] : []),
                ]}
            />
            {/* No interaction hint needed - this visualization is controlled by text scrubbers */}
        </div>
    );
}

// ── Reactive Vertex Display ───────────────────────────────────────────────────
function ReactiveVertexX() {
    const a = useVar('coefficientA', 1) as number;
    const b = useVar('coefficientB', 0) as number;
    if (a === 0) return <span>undefined</span>;
    const vertexX = -b / (2 * a);
    return <span style={{ color: '#8E90F5', fontWeight: 600 }}>{vertexX.toFixed(1)}</span>;
}

function ReactiveVertexY() {
    const a = useVar('coefficientA', 1) as number;
    const b = useVar('coefficientB', 0) as number;
    const c = useVar('coefficientC', 0) as number;
    if (a === 0) return <span>undefined</span>;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    return <span style={{ color: '#F7B23B', fontWeight: 600 }}>{vertexY.toFixed(1)}</span>;
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const coefficientsBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-coeff-title" maxWidth="xl">
        <Block id="coeff-title" padding="md">
            <EditableH2 id="h2-coeff-title" blockId="coeff-title">
                How Coefficients Transform the Parabola
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-coeff-intro" maxWidth="xl">
        <Block id="coeff-intro" padding="sm">
            <EditableParagraph id="para-coeff-intro" blockId="coeff-intro">
                The general form of a quadratic function is y = ax² + bx + c. Each coefficient
                plays a distinct role in shaping the parabola. The faded grey curve below shows
                the basic y = x² for comparison, while the teal curve shows your customized parabola.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive formula
    <StackLayout key="layout-coeff-formula" maxWidth="xl">
        <Block id="coeff-formula" padding="md">
            <FormulaBlock
                latex="y = \clr{a}{a}x^2 + \clr{b}{b}x + \clr{c}{c}"
                colorMap={{ a: '#62D0AD', b: '#8E90F5', c: '#F7B23B' }}
            />
        </Block>
    </StackLayout>,

    // Main interactive visualization
    <SplitLayout key="layout-coeff-explorer" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="coeff-controls" padding="sm">
                <EditableParagraph id="para-coeff-controls" blockId="coeff-controls">
                    <InlineSpotColor varName="coefficientA" {...spotColorPropsFromDefinition(getVariableInfo('coefficientA'))}>
                        a
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="coefficientA"
                        {...numberPropsFromDefinition(getVariableInfo('coefficientA'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="coefficientB" {...spotColorPropsFromDefinition(getVariableInfo('coefficientB'))}>
                        b
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="coefficientB"
                        {...numberPropsFromDefinition(getVariableInfo('coefficientB'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="coefficientC" {...spotColorPropsFromDefinition(getVariableInfo('coefficientC'))}>
                        c
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="coefficientC"
                        {...numberPropsFromDefinition(getVariableInfo('coefficientC'))}
                    />
                </EditableParagraph>
            </Block>
            <Block id="coeff-reset-triggers" padding="sm">
                <EditableParagraph id="para-coeff-reset-triggers" blockId="coeff-reset-triggers">
                    Try these presets:{" "}
                    <InlineTrigger varName="coefficientA" value={1} icon="refresh">
                        reset to y = x²
                    </InlineTrigger>
                    {" "}or explore a{" "}
                    <InlineTrigger varName="coefficientA" value={-1} icon="zap">
                        downward parabola
                    </InlineTrigger>
                    .
                </EditableParagraph>
            </Block>
            <Block id="coeff-vertex-info" padding="sm">
                <EditableParagraph id="para-coeff-vertex-info" blockId="coeff-vertex-info">
                    The red point marks the vertex at (<ReactiveVertexX />, <ReactiveVertexY />).
                    The amber point shows where the parabola crosses the y-axis (the y-intercept).
                </EditableParagraph>
            </Block>
        </div>
        <Block id="coeff-visualization" padding="sm" hasVisualization>
            <CoefficientsVisualization />
        </Block>
    </SplitLayout>,

    // Coefficient a explanation
    <StackLayout key="layout-coeff-a-heading" maxWidth="xl">
        <Block id="coeff-a-heading" padding="sm">
            <EditableH3 id="h3-coeff-a-heading" blockId="coeff-a-heading">
                The Coefficient a: Direction and Width
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-a-explanation" maxWidth="xl">
        <Block id="coeff-a-explanation" padding="sm">
            <EditableParagraph id="para-coeff-a-explanation" blockId="coeff-a-explanation">
                The coefficient{" "}
                <InlineSpotColor varName="coefficientA" {...spotColorPropsFromDefinition(getVariableInfo('coefficientA'))}>
                    a
                </InlineSpotColor>
                {" "}controls two things: the direction the parabola opens and how wide or narrow it is.
                When a is positive, the parabola opens upward like a smile. When a is negative, it flips
                and opens downward like a frown. The larger the absolute value of a, the narrower the
                parabola becomes. Try setting a to 2, then to 0.5, and notice the difference in width.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Coefficient c explanation
    <StackLayout key="layout-coeff-c-heading" maxWidth="xl">
        <Block id="coeff-c-heading" padding="sm">
            <EditableH3 id="h3-coeff-c-heading" blockId="coeff-c-heading">
                The Coefficient c: Vertical Position
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-c-explanation" maxWidth="xl">
        <Block id="coeff-c-explanation" padding="sm">
            <EditableParagraph id="para-coeff-c-explanation" blockId="coeff-c-explanation">
                The coefficient{" "}
                <InlineSpotColor varName="coefficientC" {...spotColorPropsFromDefinition(getVariableInfo('coefficientC'))}>
                    c
                </InlineSpotColor>
                {" "}is the simplest to understand: it shifts the entire parabola up or down. It also
                tells you exactly where the parabola crosses the y-axis. When you set c to 3, the
                parabola moves up 3 units, and it crosses the y-axis at the point (0, 3). This is why
                c is called the y-intercept.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Coefficient b explanation
    <StackLayout key="layout-coeff-b-heading" maxWidth="xl">
        <Block id="coeff-b-heading" padding="sm">
            <EditableH3 id="h3-coeff-b-heading" blockId="coeff-b-heading">
                The Coefficient b: Horizontal Shift
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-b-explanation" maxWidth="xl">
        <Block id="coeff-b-explanation" padding="sm">
            <EditableParagraph id="para-coeff-b-explanation" blockId="coeff-b-explanation">
                The coefficient{" "}
                <InlineSpotColor varName="coefficientB" {...spotColorPropsFromDefinition(getVariableInfo('coefficientB'))}>
                    b
                </InlineSpotColor>
                {" "}is trickier. It works together with a to shift the parabola left or right. Watch
                the vertex (red point) move as you change b. The horizontal position of the vertex is
                given by the formula x = −b/(2a). When b is positive, the vertex moves left (for
                positive a); when b is negative, it moves right.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-coeff-question" maxWidth="xl">
        <Block id="coeff-question" padding="md">
            <EditableParagraph id="para-coeff-question" blockId="coeff-question">
                <strong>Check your understanding:</strong> If the coefficient a is negative, the parabola opens{" "}
                <InlineFeedback
                    varName="answerParabolaDirection"
                    correctValue="downward"
                    position="terminal"
                    successMessage="— exactly right! A negative a flips the parabola upside down"
                    failureMessage="— not quite"
                    hint="Think about what happens when you multiply x² by a negative number"
                    reviewBlockId="coeff-a-explanation"
                    reviewLabel="Review the effect of coefficient a"
                >
                    <InlineClozeChoice
                        varName="answerParabolaDirection"
                        correctAnswer="downward"
                        options={["upward", "downward", "left", "right"]}
                        {...choicePropsFromDefinition(getVariableInfo('answerParabolaDirection'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
