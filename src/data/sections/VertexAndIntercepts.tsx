import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineClozeInput,
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
                        position: [h, k],
                        color: "#ef4444",
                        onChange: (point) => {
                            const newH = Math.round(point[0] * 2) / 2;
                            const newK = Math.round(point[1] * 2) / 2;
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
                        label: "Drag the red vertex to move the parabola",
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

    if (a === 0) return <span>undefined</span>;

    const discriminant = -k / a;

    if (discriminant < 0) {
        return <span style={{ color: '#94a3b8' }}>none</span>;
    } else if (discriminant === 0) {
        return <span style={{ color: '#AC8BF9', fontWeight: 600 }}>x = {h.toFixed(1)}</span>;
    } else {
        const x1 = h - Math.sqrt(discriminant);
        const x2 = h + Math.sqrt(discriminant);
        return (
            <span style={{ color: '#AC8BF9', fontWeight: 600 }}>
                x = {x1.toFixed(1)}, {x2.toFixed(1)}
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
                The vertex form makes the vertex coordinates obvious: the vertex is at (h, k).
            </EditableParagraph>
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
            <Block id="vertex-intercept-info" padding="sm">
                <EditableParagraph id="para-vertex-intercept-info" blockId="vertex-intercept-info">
                    <strong>Y-intercept:</strong> <ReactiveYIntercept />
                    <br />
                    <strong>X-intercepts:</strong> <ReactiveXIntercepts />
                </EditableParagraph>
            </Block>
            <Block id="vertex-drag-instruction" padding="sm">
                <EditableParagraph id="para-vertex-drag-instruction" blockId="vertex-drag-instruction">
                    Drag the red vertex or scrub h and k above. Move the vertex up/down to see
                    how the number of x-intercepts changes.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="vertex-visualization" padding="sm" hasVisualization>
            <VertexFormVisualization />
        </Block>
    </SplitLayout>,

    // Key points
    <StackLayout key="layout-vertex-key-points" maxWidth="xl">
        <Block id="vertex-key-points" padding="sm">
            <EditableParagraph id="para-vertex-key-points" blockId="vertex-key-points">
                <strong>Y-intercept:</strong> Set x = 0 and calculate y.
                <br />
                <strong>X-intercepts:</strong> Set y = 0 and solve. A parabola can have 0, 1, or 2 x-intercepts.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment
    <StackLayout key="layout-vertex-question" maxWidth="xl">
        <Block id="vertex-question" padding="md">
            <EditableParagraph id="para-vertex-question" blockId="vertex-question">
                <strong>Quick check:</strong> For y = (x − 2)² − 4, the vertex x-coordinate is{" "}
                <InlineFeedback
                    varName="answerVertexX"
                    correctValue="2"
                    position="terminal"
                    successMessage="— correct! h = 2"
                    failureMessage="— try again"
                    hint="Look at the number subtracted from x"
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
