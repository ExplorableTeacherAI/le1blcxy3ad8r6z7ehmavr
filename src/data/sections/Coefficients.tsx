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
    );
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
                The general quadratic is y = ax² + bx + c. The grey curve shows y = x² for comparison.
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
            <Block id="coeff-info" padding="sm">
                <EditableParagraph id="para-coeff-info" blockId="coeff-info">
                    The red point is the vertex. The amber point is the y-intercept.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="coeff-visualization" padding="sm" hasVisualization>
            <CoefficientsVisualization />
        </Block>
    </SplitLayout>,

    // Coefficient a
    <StackLayout key="layout-coeff-a-heading" maxWidth="xl">
        <Block id="coeff-a-heading" padding="sm">
            <EditableH3 id="h3-coeff-a-heading" blockId="coeff-a-heading">
                Coefficient a: Direction and Width
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-a-explanation" maxWidth="xl">
        <Block id="coeff-a-explanation" padding="sm">
            <EditableParagraph id="para-coeff-a-explanation" blockId="coeff-a-explanation">
                Positive a opens upward, negative a opens downward.
                Larger |a| makes it narrower; smaller |a| makes it wider.
                Try a = 2 vs a = 0.5.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Coefficient c
    <StackLayout key="layout-coeff-c-heading" maxWidth="xl">
        <Block id="coeff-c-heading" padding="sm">
            <EditableH3 id="h3-coeff-c-heading" blockId="coeff-c-heading">
                Coefficient c: Vertical Shift
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-c-explanation" maxWidth="xl">
        <Block id="coeff-c-explanation" padding="sm">
            <EditableParagraph id="para-coeff-c-explanation" blockId="coeff-c-explanation">
                The value c shifts the parabola up or down and equals the y-intercept.
                When c = 3, the parabola crosses the y-axis at (0, 3).
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Coefficient b
    <StackLayout key="layout-coeff-b-heading" maxWidth="xl">
        <Block id="coeff-b-heading" padding="sm">
            <EditableH3 id="h3-coeff-b-heading" blockId="coeff-b-heading">
                Coefficient b: Horizontal Shift
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-coeff-b-explanation" maxWidth="xl">
        <Block id="coeff-b-explanation" padding="sm">
            <EditableParagraph id="para-coeff-b-explanation" blockId="coeff-b-explanation">
                The value b shifts the vertex left or right. The vertex x-coordinate is −b/(2a).
                Watch the red point move as you change b.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment
    <StackLayout key="layout-coeff-question" maxWidth="xl">
        <Block id="coeff-question" padding="md">
            <EditableParagraph id="para-coeff-question" blockId="coeff-question">
                <strong>Quick check:</strong> If a is negative, the parabola opens{" "}
                <InlineFeedback
                    varName="answerParabolaDirection"
                    correctValue="downward"
                    position="terminal"
                    successMessage="— correct!"
                    failureMessage="— try again"
                    hint="Negative a flips the parabola"
                    visualizationHint={{
                        blockId: "coeff-visualization",
                        hintKey: "coeff-direction-hint",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Look at the graph when a is negative",
                                position: { x: "50%", y: "30%" },
                            }
                        ],
                        label: "Check the graph",
                        resetVars: { coefficientA: -1, coefficientB: 0, coefficientC: 0 },
                    }}
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
