import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    Cartesian2D,
} from "@/components/atoms";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition } from "../variables";
import { useVar, useSetVar } from "@/stores";

// ── Reactive Basketball Trajectory Visualization ──────────────────────────────
function BasketballTrajectory() {
    const angle = useVar('launchAngle', 55) as number;
    const setVar = useSetVar();

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Physics parameters
    const v0 = 8;
    const g = 9.8;
    const startX = -3;
    const startY = 1.5;
    const maxT = 2.5;

    // Velocity components based on current angle
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);

    // Trajectory function
    const trajectoryFn = (t: number): [number, number] => {
        const x = startX + vx * t;
        const y = startY + vy * t - 0.5 * g * t * t;
        return [x, y];
    };

    // Draggable point position on the arc
    const dragPointX = startX + 1.5 * Math.cos(angleRad);
    const dragPointY = startY + 1.5 * Math.sin(angleRad);

    return (
        <div className="relative">
            <Cartesian2D
                height={350}
                viewBox={{ x: [-4, 5], y: [-0.5, 6] }}
                showGrid={true}
                plots={[
                    // Ground
                    { type: "segment", point1: [-4, 0], point2: [5, 0], color: "#94a3b8", weight: 2 },
                    // Hoop backboard
                    { type: "segment", point1: [3.5, 2.5], point2: [3.5, 4], color: "#64748b", weight: 3 },
                    // Hoop rim
                    { type: "segment", point1: [3, 3], point2: [3.5, 3], color: "#ef4444", weight: 4 },
                    // Player
                    { type: "segment", point1: [-3, 0], point2: [-3, 1.2], color: "#8E90F5", weight: 3 },
                    { type: "point", x: -3, y: 1.5, color: "#8E90F5" },
                    // Trajectory arc
                    {
                        type: "parametric",
                        xy: trajectoryFn,
                        tRange: [0, maxT] as [number, number],
                        color: "#F7B23B",
                        weight: 3,
                    },
                    // Direction arrow
                    {
                        type: "segment",
                        point1: [startX, startY] as [number, number],
                        point2: [dragPointX, dragPointY] as [number, number],
                        color: "#62D0AD",
                        weight: 2,
                        style: "dashed",
                    },
                ]}
                movablePoints={[
                    {
                        initial: [dragPointX, dragPointY],
                        position: [dragPointX, dragPointY],
                        color: "#62D0AD",
                        constrain: (point) => {
                            const dx = point[0] - startX;
                            const dy = point[1] - startY;
                            const currentAngle = Math.atan2(dy, dx);
                            const clampedAngle = Math.max(30 * Math.PI / 180, Math.min(75 * Math.PI / 180, currentAngle));
                            return [startX + 1.5 * Math.cos(clampedAngle), startY + 1.5 * Math.sin(clampedAngle)];
                        },
                        onChange: (point) => {
                            const dx = point[0] - startX;
                            const dy = point[1] - startY;
                            const newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
                            setVar('launchAngle', Math.round(Math.max(30, Math.min(75, newAngle))));
                        },
                    }
                ]}
            />
            <InteractionHintSequence
                hintKey="basketball-angle-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point to change the launch angle",
                        position: { x: "30%", y: "55%" },
                    }
                ]}
            />
        </div>
    );
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const introductionBlocks: ReactElement[] = [
    // Title
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="intro-title" padding="lg">
            <EditableH1 id="h1-intro-title" blockId="intro-title">
                Quadratic Functions
            </EditableH1>
        </Block>
    </StackLayout>,

    // Hook paragraph
    <StackLayout key="layout-intro-hook" maxWidth="xl">
        <Block id="intro-hook" padding="sm">
            <EditableParagraph id="para-intro-hook" blockId="intro-hook">
                Every basketball shot traces a curved path through the air. This curve is called
                a parabola, and it's described by a quadratic function. Let's explore how it works.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Section heading
    <StackLayout key="layout-intro-trajectory-heading" maxWidth="xl">
        <Block id="intro-trajectory-heading" padding="sm">
            <EditableH2 id="h2-intro-trajectory-heading" blockId="intro-trajectory-heading">
                The Path of a Basketball
            </EditableH2>
        </Block>
    </StackLayout>,

    // Interactive visualization with explanation
    <SplitLayout key="layout-intro-basketball" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="intro-basketball-angle" padding="sm">
                <EditableParagraph id="para-intro-basketball-angle" blockId="intro-basketball-angle">
                    Launch angle:{" "}
                    <InlineScrubbleNumber
                        varName="launchAngle"
                        {...numberPropsFromDefinition(getVariableInfo('launchAngle'))}
                        formatValue={(v) => `${v}°`}
                    />
                </EditableParagraph>
            </Block>
            <Block id="intro-basketball-explanation" padding="sm">
                <EditableParagraph id="para-intro-basketball-explanation" blockId="intro-basketball-explanation">
                    Drag the teal point or scrub the angle above to see how the trajectory changes.
                    A steeper angle creates a higher, shorter arc. A flatter angle creates a longer, lower path.
                </EditableParagraph>
            </Block>
        </div>
        <Block id="intro-basketball-visualization" padding="sm" hasVisualization>
            <BasketballTrajectory />
        </Block>
    </SplitLayout>,

    // Transition paragraph
    <StackLayout key="layout-intro-transition" maxWidth="xl">
        <Block id="intro-transition" padding="sm">
            <EditableParagraph id="para-intro-transition" blockId="intro-transition">
                This arc follows a quadratic function. Let's learn what makes these functions special.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
