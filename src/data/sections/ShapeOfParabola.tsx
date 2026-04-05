import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineTooltip,
    InlineSpotColor,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition, spotColorPropsFromDefinition } from "../variables";
import { useVar, useSetVar } from "@/stores";

// ── Reactive Basic Parabola Visualization ─────────────────────────────────────
function BasicParabolaVisualization() {
    const xValue = useVar('basicParabolaX', 2) as number;
    const setVar = useSetVar();
    const yValue = xValue * xValue;

    return (
        <div className="relative">
            <Cartesian2D
                height={380}
                viewBox={{ x: [-5, 5], y: [-1, 17] }}
                showGrid={true}
                plots={[
                    // The parabola y = x²
                    {
                        type: "function",
                        fn: (x) => x * x,
                        color: "#62D0AD",
                        weight: 3,
                    },
                    // Axis of symmetry (y-axis)
                    {
                        type: "segment",
                        point1: [0, -1],
                        point2: [0, 17],
                        color: "#94a3b8",
                        weight: 1,
                        style: "dashed",
                    },
                    // Vertex point
                    {
                        type: "point",
                        x: 0,
                        y: 0,
                        color: "#F7B23B",
                    },
                ]}
                movablePoints={[
                    {
                        initial: [xValue, yValue],
                        color: "#8E90F5",
                        constrain: (point) => {
                            // Constrain to the parabola y = x²
                            const x = Math.max(-4, Math.min(4, point[0]));
                            return [x, x * x];
                        },
                        onChange: (point) => {
                            const newX = Math.round(point[0] * 2) / 2; // Round to 0.5
                            setVar('basicParabolaX', newX);
                        },
                    },
                ]}
                dynamicPlots={([point]) => [
                    // Vertical dashed line from point to x-axis
                    {
                        type: "segment" as const,
                        point1: [point[0], 0] as [number, number],
                        point2: point,
                        color: "#8E90F5",
                        weight: 1,
                        style: "dashed" as const,
                    },
                    // Horizontal dashed line from point to y-axis
                    {
                        type: "segment" as const,
                        point1: [0, point[1]] as [number, number],
                        point2: point,
                        color: "#8E90F5",
                        weight: 1,
                        style: "dashed" as const,
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="basic-parabola-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the indigo point along the curve",
                        position: { x: "70%", y: "35%" },
                    }
                ]}
            />
        </div>
    );
}

// ── Reactive Y Value Display ──────────────────────────────────────────────────
function ReactiveYValue() {
    const xValue = useVar('basicParabolaX', 2) as number;
    const yValue = xValue * xValue;
    return <span style={{ color: '#62D0AD', fontWeight: 600 }}>{yValue.toFixed(1)}</span>;
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const shapeOfParabolaBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-shape-title" maxWidth="xl">
        <Block id="shape-title" padding="md">
            <EditableH2 id="h2-shape-title" blockId="shape-title">
                The Shape of a Parabola
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction to y = x²
    <StackLayout key="layout-shape-intro" maxWidth="xl">
        <Block id="shape-intro" padding="sm">
            <EditableParagraph id="para-shape-intro" blockId="shape-intro">
                The simplest quadratic function is{" "}
                <InlineTooltip
                    id="tooltip-y-equals-x-squared"
                    tooltip="This function squares its input: when x = 3, y = 9; when x = -2, y = 4."
                >
                    y = x²
                </InlineTooltip>
                . Its graph creates the classic U-shaped curve we call a parabola. Every point on
                this curve has a special relationship: the y-coordinate is always the square of
                the x-coordinate.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Formula block
    <StackLayout key="layout-shape-formula" maxWidth="xl">
        <Block id="shape-formula" padding="md">
            <FormulaBlock
                latex="y = x^2"
                colorMap={{ y: '#62D0AD', x: '#8E90F5' }}
            />
        </Block>
    </StackLayout>,

    // Interactive visualization with explanation
    <SplitLayout key="layout-shape-exploration" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="shape-exploration-text" padding="sm">
                <EditableParagraph id="para-shape-exploration-text" blockId="shape-exploration-text">
                    Drag the{" "}
                    <InlineSpotColor varName="basicParabolaX" {...spotColorPropsFromDefinition(getVariableInfo('basicParabolaX'))}>
                        indigo point
                    </InlineSpotColor>
                    {" "}along the curve to explore this relationship. Watch how the y-value changes
                    as you move left and right.
                </EditableParagraph>
            </Block>
            <Block id="shape-current-values" padding="sm">
                <EditableParagraph id="para-shape-current-values" blockId="shape-current-values">
                    When x ={" "}
                    <InlineScrubbleNumber
                        varName="basicParabolaX"
                        {...numberPropsFromDefinition(getVariableInfo('basicParabolaX'))}
                    />
                    , then y = x² = <ReactiveYValue />. Notice that squaring a negative number
                    gives a positive result, which is why the parabola never dips below the x-axis.
                </EditableParagraph>
            </Block>
            <Block id="shape-vertex-explanation" padding="sm">
                <EditableParagraph id="para-shape-vertex-explanation" blockId="shape-vertex-explanation">
                    The lowest point of this parabola is at the origin (0, 0). This special point
                    is called the{" "}
                    <InlineTooltip
                        id="tooltip-vertex"
                        tooltip="The vertex is the turning point of a parabola — either its highest or lowest point."
                    >
                        vertex
                    </InlineTooltip>
                    . From here, the curve rises equally on both sides, creating perfect symmetry
                    around the y-axis.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="shape-visualization" padding="sm" hasVisualization>
            <BasicParabolaVisualization />
        </Block>
    </SplitLayout>,

    // Key features summary
    <StackLayout key="layout-shape-features" maxWidth="xl">
        <Block id="shape-features" padding="sm">
            <EditableParagraph id="para-shape-features" blockId="shape-features">
                Every parabola has these key features: a{" "}
                <InlineTooltip
                    id="tooltip-vertex-feature"
                    tooltip="The highest or lowest point on the parabola."
                >
                    vertex
                </InlineTooltip>
                {" "}(the turning point), an{" "}
                <InlineTooltip
                    id="tooltip-axis-symmetry"
                    tooltip="A vertical line that divides the parabola into two mirror-image halves."
                >
                    axis of symmetry
                </InlineTooltip>
                {" "}(the vertical line through the vertex), and it either opens upward (like a smile)
                or downward (like a frown). For y = x², the vertex is at the origin and it opens upward.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Transition to next section
    <StackLayout key="layout-shape-transition" maxWidth="xl">
        <Block id="shape-transition" padding="sm">
            <EditableParagraph id="para-shape-transition" blockId="shape-transition">
                But what if we want to change the shape of this parabola? What if we want it to be
                wider, narrower, or even flip upside down? That's where the coefficients a, b, and c
                come in. Let's explore how they transform our parabola.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
