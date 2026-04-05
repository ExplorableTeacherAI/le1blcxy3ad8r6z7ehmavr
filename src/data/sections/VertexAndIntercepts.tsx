import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableH3,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineClozeInput,
    InlineTooltip,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InlineFeedback } from "@/components/atoms/text/InlineFeedback";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition, spotColorPropsFromDefinition, clozePropsFromDefinition } from "../variables";
import { useVar, useSetVar } from "@/stores";

// ── Reactive Vertex Form Visualization ────────────────────────────────────────
function VertexFormVisualization() {
    const a = useVar('vertexExampleA', 1) as number;
    const h = useVar('vertexExampleH', 2) as number;
    const k = useVar('vertexExampleK', -1) as number;
    const setVar = useSetVar();

    // Vertex form: y = a(x - h)² + k
    const vertexForm = (x: number) => a * Math.pow(x - h, 2) + k;

    // Calculate y-intercept
    const yIntercept = vertexForm(0);

    // Calculate x-intercepts (if they exist)
    const discriminant = -k / a;
    const hasXIntercepts = a !== 0 && discriminant >= 0;
    const xIntercept1 = hasXIntercepts ? h - Math.sqrt(discriminant) : null;
    const xIntercept2 = hasXIntercepts ? h + Math.sqrt(discriminant) : null;

    return (
        <div className="relative">
            <Cartesian2D
                height={400}
                viewBox={{ x: [-6, 8], y: [-6, 8] }}
                showGrid={true}
                plots={[
                    // Axis of symmetry
                    {
                        type: "segment",
                        point1: [h, -6],
                        point2: [h, 8],
                        color: "#94a3b8",
                        weight: 1,
                        style: "dashed",
                    },
                    // Main quadratic function
                    ...(a !== 0 ? [{
                        type: "function" as const,
                        fn: vertexForm,
                        color: "#62D0AD",
                        weight: 3,
                    }] : []),
                    // Y-intercept point
                    {
                        type: "point" as const,
                        x: 0,
                        y: yIntercept,
                        color: "#F7B23B",
                    },
                    // X-intercepts (if they exist)
                    ...(hasXIntercepts && xIntercept1 !== null ? [{
                        type: "point" as const,
                        x: xIntercept1,
                        y: 0,
                        color: "#AC8BF9",
                    }] : []),
                    ...(hasXIntercepts && xIntercept2 !== null && Math.abs(xIntercept1! - xIntercept2) > 0.1 ? [{
                        type: "point" as const,
                        x: xIntercept2,
                        y: 0,
                        color: "#AC8BF9",
                    }] : []),
                ]}
                movablePoints={[
                    {
                        initial: [h, k],
                        color: "#ef4444",
                        onChange: (point) => {
                            // Round to nearest 0.5
                            const newH = Math.round(point[0] * 2) / 2;
                            const newK = Math.round(point[1] * 2) / 2;
                            // Clamp to bounds
                            setVar('vertexExampleH', Math.max(-4, Math.min(4, newH)));
                            setVar('vertexExampleK', Math.max(-4, Math.min(4, newK)));
                        },
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="vertex-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag the red vertex point to move the parabola",
                        position: { x: "67%", y: "57%" },
                    }
                ]}
            />
        </div>
    );
}

// ── Reactive displays ─────────────────────────────────────────────────────────
function ReactiveYIntercept() {
    const a = useVar('vertexExampleA', 1) as number;
    const h = useVar('vertexExampleH', 2) as number;
    const k = useVar('vertexExampleK', -1) as number;
    const yIntercept = a * h * h + k;
    return <span style={{ color: '#F7B23B', fontWeight: 600 }}>{yIntercept.toFixed(1)}</span>;
}

function ReactiveXIntercepts() {
    const a = useVar('vertexExampleA', 1) as number;
    const h = useVar('vertexExampleH', 2) as number;
    const k = useVar('vertexExampleK', -1) as number;

    if (a === 0) return <span>undefined (not a parabola)</span>;

    const discriminant = -k / a;

    if (discriminant < 0) {
        return <span style={{ color: '#94a3b8' }}>none (parabola doesn't cross x-axis)</span>;
    } else if (discriminant === 0) {
        return <span style={{ color: '#AC8BF9', fontWeight: 600 }}>x = {h.toFixed(1)} (one point)</span>;
    } else {
        const x1 = h - Math.sqrt(discriminant);
        const x2 = h + Math.sqrt(discriminant);
        return (
            <span style={{ color: '#AC8BF9', fontWeight: 600 }}>
                x = {x1.toFixed(1)} and x = {x2.toFixed(1)}
            </span>
        );
    }
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const vertexAndInterceptsBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-vertex-title" maxWidth="xl">
        <Block id="vertex-title" padding="md">
            <EditableH2 id="h2-vertex-title" blockId="vertex-title">
                Finding the Vertex and Intercepts
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-vertex-intro" maxWidth="xl">
        <Block id="vertex-intro" padding="sm">
            <EditableParagraph id="para-vertex-intro" blockId="vertex-intro">
                To sketch a parabola accurately, you need to find its key points: the vertex (the
                turning point) and the intercepts (where it crosses the axes). There's a special
                form of the quadratic equation that makes finding the vertex incredibly easy.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Vertex form heading
    <StackLayout key="layout-vertex-form-heading" maxWidth="xl">
        <Block id="vertex-form-heading" padding="sm">
            <EditableH3 id="h3-vertex-form-heading" blockId="vertex-form-heading">
                The Vertex Form
            </EditableH3>
        </Block>
    </StackLayout>,

    // Vertex form formula
    <StackLayout key="layout-vertex-formula" maxWidth="xl">
        <Block id="vertex-formula" padding="md">
            <FormulaBlock
                latex="y = \clr{a}{a}(x - \clr{h}{h})^2 + \clr{k}{k}"
                colorMap={{ a: '#62D0AD', h: '#8E90F5', k: '#F7B23B' }}
            />
        </Block>
    </StackLayout>,

    // Explanation
    <StackLayout key="layout-vertex-form-explanation" maxWidth="xl">
        <Block id="vertex-form-explanation" padding="sm">
            <EditableParagraph id="para-vertex-form-explanation" blockId="vertex-form-explanation">
                In vertex form, the vertex is simply the point ({" "}
                <InlineSpotColor varName="vertexExampleH" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleH'))}>
                    h
                </InlineSpotColor>
                ,{" "}
                <InlineSpotColor varName="vertexExampleK" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleK'))}>
                    k
                </InlineSpotColor>
                {" "}). The value{" "}
                <InlineSpotColor varName="vertexExampleH" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleH'))}>
                    h
                </InlineSpotColor>
                {" "}shifts the parabola horizontally, and{" "}
                <InlineSpotColor varName="vertexExampleK" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleK'))}>
                    k
                </InlineSpotColor>
                {" "}shifts it vertically. Notice the minus sign in front of h in the formula.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-vertex-explorer" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="vertex-controls" padding="sm">
                <EditableParagraph id="para-vertex-controls" blockId="vertex-controls">
                    <InlineSpotColor varName="vertexExampleA" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleA'))}>
                        a
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="vertexExampleA"
                        {...numberPropsFromDefinition(getVariableInfo('vertexExampleA'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="vertexExampleH" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleH'))}>
                        h
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="vertexExampleH"
                        {...numberPropsFromDefinition(getVariableInfo('vertexExampleH'))}
                    />
                    {" "} · {" "}
                    <InlineSpotColor varName="vertexExampleK" {...spotColorPropsFromDefinition(getVariableInfo('vertexExampleK'))}>
                        k
                    </InlineSpotColor>
                    {" "}={" "}
                    <InlineScrubbleNumber
                        varName="vertexExampleK"
                        {...numberPropsFromDefinition(getVariableInfo('vertexExampleK'))}
                    />
                </EditableParagraph>
            </Block>
            <Block id="vertex-drag-instruction" padding="sm">
                <EditableParagraph id="para-vertex-drag-instruction" blockId="vertex-drag-instruction">
                    You can also drag the red vertex point directly on the graph. Watch how the values
                    of h and k update automatically to match the vertex position.
                </EditableParagraph>
            </Block>
            <Block id="vertex-intercept-info" padding="sm">
                <EditableParagraph id="para-vertex-intercept-info" blockId="vertex-intercept-info">
                    <strong>Y-intercept</strong> (amber point): y = <ReactiveYIntercept />
                    <br /><br />
                    <strong>X-intercepts</strong> (violet points): <ReactiveXIntercepts />
                </EditableParagraph>
            </Block>
        </div>
        <Block id="vertex-visualization" padding="sm" hasVisualization>
            <VertexFormVisualization />
        </Block>
    </SplitLayout>,

    // Y-intercept explanation
    <StackLayout key="layout-y-intercept-heading" maxWidth="xl">
        <Block id="y-intercept-heading" padding="sm">
            <EditableH3 id="h3-y-intercept-heading" blockId="y-intercept-heading">
                Finding the Y-Intercept
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-y-intercept-explanation" maxWidth="xl">
        <Block id="y-intercept-explanation" padding="sm">
            <EditableParagraph id="para-y-intercept-explanation" blockId="y-intercept-explanation">
                The{" "}
                <InlineTooltip
                    id="tooltip-y-intercept"
                    tooltip="The point where the graph crosses the y-axis, found by setting x = 0."
                >
                    y-intercept
                </InlineTooltip>
                {" "}is where the parabola crosses the y-axis. To find it, simply substitute x = 0
                into the equation. In standard form y = ax² + bx + c, the y-intercept is always
                (0, c). In vertex form, you substitute x = 0 and calculate y = a(0 − h)² + k = ah² + k.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // X-intercept explanation
    <StackLayout key="layout-x-intercept-heading" maxWidth="xl">
        <Block id="x-intercept-heading" padding="sm">
            <EditableH3 id="h3-x-intercept-heading" blockId="x-intercept-heading">
                Finding the X-Intercepts (Roots)
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-x-intercept-explanation" maxWidth="xl">
        <Block id="x-intercept-explanation" padding="sm">
            <EditableParagraph id="para-x-intercept-explanation" blockId="x-intercept-explanation">
                The{" "}
                <InlineTooltip
                    id="tooltip-x-intercepts"
                    tooltip="Also called roots or zeros — the points where the graph crosses the x-axis, found by setting y = 0."
                >
                    x-intercepts
                </InlineTooltip>
                {" "}are where the parabola crosses the x-axis. A parabola can have two x-intercepts,
                one x-intercept (when the vertex touches the x-axis), or no x-intercepts at all (when
                the parabola floats entirely above or below the x-axis). Try moving the vertex up
                and down to see all three cases.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-vertex-question" maxWidth="xl">
        <Block id="vertex-question" padding="md">
            <EditableParagraph id="para-vertex-question" blockId="vertex-question">
                <strong>Check your understanding:</strong> For the equation y = (x − 2)² − 4, what is the x-coordinate of the vertex? x ={" "}
                <InlineFeedback
                    varName="answerVertexX"
                    correctValue="2"
                    position="terminal"
                    successMessage="— correct! In vertex form y = (x − h)² + k, the vertex is at (h, k), so h = 2"
                    failureMessage="— not quite"
                    hint="Look at the number being subtracted from x inside the parentheses"
                    reviewBlockId="vertex-form-explanation"
                    reviewLabel="Review the vertex form"
                >
                    <InlineClozeInput
                        varName="answerVertexX"
                        correctAnswer="2"
                        {...clozePropsFromDefinition(getVariableInfo('answerVertexX'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
