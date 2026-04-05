import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition } from "../variables";
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
                    // Vertical dashed line from point to x-axis
                    {
                        type: "segment",
                        point1: [xValue, 0] as [number, number],
                        point2: [xValue, yValue] as [number, number],
                        color: "#8E90F5",
                        weight: 1,
                        style: "dashed",
                    },
                    // Horizontal dashed line from point to y-axis
                    {
                        type: "segment",
                        point1: [0, yValue] as [number, number],
                        point2: [xValue, yValue] as [number, number],
                        color: "#8E90F5",
                        weight: 1,
                        style: "dashed",
                    },
                ]}
                movablePoints={[
                    {
                        initial: [xValue, yValue],
                        position: [xValue, yValue],
                        color: "#8E90F5",
                        constrain: (point) => {
                            const x = Math.max(-4, Math.min(4, point[0]));
                            return [x, x * x];
                        },
                        onChange: (point) => {
                            const newX = Math.round(point[0] * 2) / 2;
                            setVar('basicParabolaX', newX);
                        },
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

    // Introduction
    <StackLayout key="layout-shape-intro" maxWidth="xl">
        <Block id="shape-intro" padding="sm">
            <EditableParagraph id="para-shape-intro" blockId="shape-intro">
                The simplest quadratic is y = x². Every point on this curve has a y-value
                that equals x squared.
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

    // Interactive visualization
    <SplitLayout key="layout-shape-exploration" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="shape-current-values" padding="sm">
                <EditableParagraph id="para-shape-current-values" blockId="shape-current-values">
                    When x ={" "}
                    <InlineScrubbleNumber
                        varName="basicParabolaX"
                        {...numberPropsFromDefinition(getVariableInfo('basicParabolaX'))}
                    />
                    , then y = <ReactiveYValue />.
                </EditableParagraph>
            </Block>
            <Block id="shape-exploration-text" padding="sm">
                <EditableParagraph id="para-shape-exploration-text" blockId="shape-exploration-text">
                    Drag the indigo point along the curve. Notice that squaring a negative gives a
                    positive result, so the parabola never dips below the x-axis.
                </EditableParagraph>
            </Block>
            <Block id="shape-vertex-explanation" padding="sm">
                <EditableParagraph id="para-shape-vertex-explanation" blockId="shape-vertex-explanation">
                    The lowest point at (0, 0) is called the vertex. The curve rises equally on both
                    sides, creating symmetry around the y-axis.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="shape-visualization" padding="sm" hasVisualization>
            <BasicParabolaVisualization />
        </Block>
    </SplitLayout>,

    // Transition
    <StackLayout key="layout-shape-transition" maxWidth="xl">
        <Block id="shape-transition" padding="sm">
            <EditableParagraph id="para-shape-transition" blockId="shape-transition">
                What if we want to make the parabola wider, narrower, or flip it upside down?
                That's where coefficients come in.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
