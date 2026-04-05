import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    Cartesian2D,
    InlineTooltip,
} from "@/components/atoms";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition } from "../variables";
import { useVar } from "@/stores";

// ── Reactive Basketball Trajectory Visualization ──────────────────────────────
function BasketballTrajectory() {
    const angle = useVar('launchAngle', 55) as number;

    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180;

    // Physics parameters (simplified for visualization)
    const v0 = 8; // initial velocity
    const g = 9.8; // gravity
    const startX = -3;
    const startY = 1.5;

    // Parametric equations for projectile motion
    const vx = v0 * Math.cos(angleRad);
    const vy = v0 * Math.sin(angleRad);

    // Time of flight (until ball reaches hoop height at x = 3)
    const hoopX = 3;
    const hoopY = 3;

    // Calculate trajectory
    const trajectory = (t: number): [number, number] => {
        const x = startX + vx * t;
        const y = startY + vy * t - 0.5 * g * t * t;
        return [x, y];
    };

    // Find max time (when ball goes below ground or past hoop)
    const maxT = 2.5;

    // Calculate current ball position (for visualization of path)
    const ballT = 0.8;
    const ballPos = trajectory(ballT);

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
                    // Player (simplified stick figure)
                    { type: "segment", point1: [-3, 0], point2: [-3, 1.2], color: "#8E90F5", weight: 3 },
                    { type: "point", x: -3, y: 1.5, color: "#8E90F5" },
                    // Starting position
                    { type: "point", x: startX, y: startY, color: "#F7B23B" },
                ]}
                movablePoints={[
                    {
                        initial: [startX + 1.5 * Math.cos(angleRad), startY + 1.5 * Math.sin(angleRad)],
                        color: "#62D0AD",
                        constrain: (point) => {
                            // Constrain to arc around start point
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
                            // Update is handled by the store
                            const store = (window as unknown as { __variableStore?: { getState: () => { setVariable: (name: string, value: number) => void } } }).__variableStore;
                            if (store) {
                                store.getState().setVariable('launchAngle', Math.round(Math.max(30, Math.min(75, newAngle))));
                            }
                        },
                    }
                ]}
                dynamicPlots={([anglePoint]) => {
                    // Calculate angle from drag point
                    const dx = anglePoint[0] - startX;
                    const dy = anglePoint[1] - startY;
                    const currentAngle = Math.atan2(dy, dx);
                    const currentVx = v0 * Math.cos(currentAngle);
                    const currentVy = v0 * Math.sin(currentAngle);

                    // Generate trajectory points
                    const trajectoryFn = (t: number): [number, number] => {
                        const x = startX + currentVx * t;
                        const y = startY + currentVy * t - 0.5 * g * t * t;
                        return [x, y];
                    };

                    return [
                        // Trajectory arc
                        {
                            type: "parametric" as const,
                            xy: trajectoryFn,
                            tRange: [0, maxT] as [number, number],
                            color: "#F7B23B",
                            weight: 3,
                        },
                        // Direction arrow
                        {
                            type: "segment" as const,
                            point1: [startX, startY] as [number, number],
                            point2: anglePoint,
                            color: "#62D0AD",
                            weight: 2,
                            style: "dashed" as const,
                        },
                    ];
                }}
            />
            <InteractionHintSequence
                hintKey="basketball-angle-drag"
                steps={[
                    {
                        gesture: "drag-circular",
                        label: "Drag the teal point to change the launch angle",
                        position: { x: "30%", y: "55%" },
                        dragPath: { type: "arc", startAngle: -55, endAngle: -30, radius: 35 },
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
                Every time a basketball leaves a player's hands, it traces an invisible curve through the air.
                This curve, known as a{" "}
                <InlineTooltip
                    id="tooltip-parabola"
                    tooltip="A U-shaped curve that is symmetric about a vertical line called the axis of symmetry."
                >
                    parabola
                </InlineTooltip>
                , is one of the most important shapes in mathematics. Understanding parabolas helps us
                predict where a ball will land, design bridges that can bear enormous weight, and even
                focus satellite signals from space.
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
            <Block id="intro-basketball-explanation" padding="sm">
                <EditableParagraph id="para-intro-basketball-explanation" blockId="intro-basketball-explanation">
                    Watch how the basketball's path changes as you adjust the launch angle.
                    The teal point controls the angle at which the ball is thrown. Drag it higher
                    for a steeper shot, or lower for a flatter trajectory.
                </EditableParagraph>
            </Block>
            <Block id="intro-basketball-angle" padding="sm">
                <EditableParagraph id="para-intro-basketball-angle" blockId="intro-basketball-angle">
                    Current launch angle:{" "}
                    <InlineScrubbleNumber
                        varName="launchAngle"
                        {...numberPropsFromDefinition(getVariableInfo('launchAngle'))}
                        formatValue={(v) => `${v}°`}
                    />
                    . Notice how the arc becomes higher and shorter when the angle is steep,
                    and longer and flatter when the angle is small.
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
                This beautiful arc is described by a{" "}
                <InlineTooltip
                    id="tooltip-quadratic"
                    tooltip="An equation where the highest power of the variable is 2, like x² + 3x + 2."
                >
                    quadratic function
                </InlineTooltip>
                . In this lesson, we will explore how these functions work, what controls their shape,
                and how to use them to solve real problems. Let's begin by understanding the simplest
                parabola of all.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
