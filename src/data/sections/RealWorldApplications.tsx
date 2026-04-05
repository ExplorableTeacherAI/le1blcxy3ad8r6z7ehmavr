import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    Cartesian2D,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import { InlineFeedback } from "@/components/atoms/text/InlineFeedback";
import { InteractionHintSequence } from "@/components/atoms/visual/InteractionHint";
import { getVariableInfo, numberPropsFromDefinition, clozePropsFromDefinition } from "../variables";
import { useVar, useSetVar } from "@/stores";

// ── Reactive Projectile Motion Visualization ──────────────────────────────────
function ProjectileVisualization() {
    const t = useVar('projectileTime', 1) as number;
    const v0 = useVar('projectileVelocity', 20) as number;
    const setVar = useSetVar();

    const g = 10;
    const height = (time: number) => Math.max(0, v0 * time - 0.5 * g * time * time);
    const maxTime = (2 * v0) / g;
    const maxHeightTime = v0 / g;
    const maxHeight = height(maxHeightTime);
    const currentHeight = height(t);

    return (
        <div className="relative">
            <Cartesian2D
                height={380}
                viewBox={{ x: [-0.5, 5], y: [-2, 25] }}
                showGrid={true}
                plots={[
                    // Ground
                    { type: "segment", point1: [-0.5, 0], point2: [5, 0], color: "#64748b", weight: 2 },
                    // Trajectory curve
                    {
                        type: "function",
                        fn: (x) => Math.max(0, v0 * x - 0.5 * g * x * x),
                        color: "#62D0AD",
                        weight: 3,
                        domain: [0, maxTime],
                    },
                    // Max height line
                    {
                        type: "segment",
                        point1: [0, maxHeight],
                        point2: [maxHeightTime, maxHeight],
                        color: "#F7B23B",
                        weight: 1,
                        style: "dashed",
                    },
                    // Max height point
                    {
                        type: "point",
                        x: maxHeightTime,
                        y: maxHeight,
                        color: "#F7B23B",
                    },
                    // Landing point
                    {
                        type: "point",
                        x: maxTime,
                        y: 0,
                        color: "#AC8BF9",
                    },
                ]}
                movablePoints={[
                    {
                        initial: [t, currentHeight],
                        position: [t, currentHeight],
                        color: "#ef4444",
                        constrain: (point) => {
                            const time = Math.max(0, Math.min(maxTime, point[0]));
                            return [time, Math.max(0, height(time))];
                        },
                        onChange: (point) => {
                            setVar('projectileTime', Math.round(point[0] * 10) / 10);
                        },
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="projectile-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the red ball along the trajectory",
                        position: { x: "35%", y: "40%" },
                    }
                ]}
            />
        </div>
    );
}

// ── Reactive displays ─────────────────────────────────────────────────────────
function ReactiveHeight() {
    const t = useVar('projectileTime', 1) as number;
    const v0 = useVar('projectileVelocity', 20) as number;
    const g = 10;
    const height = Math.max(0, v0 * t - 0.5 * g * t * t);
    return <span style={{ color: '#62D0AD', fontWeight: 600 }}>{height.toFixed(1)} m</span>;
}

function ReactiveMaxHeight() {
    const v0 = useVar('projectileVelocity', 20) as number;
    const maxHeight = (v0 * v0) / 20;
    return <span style={{ color: '#F7B23B', fontWeight: 600 }}>{maxHeight.toFixed(0)} m</span>;
}

function ReactiveTotalTime() {
    const v0 = useVar('projectileVelocity', 20) as number;
    return <span style={{ color: '#AC8BF9', fontWeight: 600 }}>{(v0 / 5).toFixed(1)} s</span>;
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const realWorldApplicationsBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-realworld-title" maxWidth="xl">
        <Block id="realworld-title" padding="md">
            <EditableH2 id="h2-realworld-title" blockId="realworld-title">
                Real-World Application: Projectile Motion
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-realworld-intro" maxWidth="xl">
        <Block id="realworld-intro" padding="sm">
            <EditableParagraph id="para-realworld-intro" blockId="realworld-intro">
                When you throw a ball upward, its height follows a quadratic function.
                Gravity causes the downward curve.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Height formula
    <StackLayout key="layout-height-formula" maxWidth="xl">
        <Block id="height-formula" padding="md">
            <FormulaBlock
                latex="h(t) = \clr{v0}{v_0}t - \frac{1}{2}\clr{g}{g}t^2"
                colorMap={{ v0: '#62D0AD', g: '#ef4444' }}
            />
        </Block>
    </StackLayout>,

    // Interactive visualization
    <SplitLayout key="layout-projectile-explorer" ratio="1:1" gap="lg">
        <div className="space-y-4">
            <Block id="projectile-controls" padding="sm">
                <EditableParagraph id="para-projectile-controls" blockId="projectile-controls">
                    Initial velocity:{" "}
                    <InlineScrubbleNumber
                        varName="projectileVelocity"
                        {...numberPropsFromDefinition(getVariableInfo('projectileVelocity'))}
                        formatValue={(v) => `${v} m/s`}
                    />
                </EditableParagraph>
            </Block>
            <Block id="projectile-time" padding="sm">
                <EditableParagraph id="para-projectile-time" blockId="projectile-time">
                    Time:{" "}
                    <InlineScrubbleNumber
                        varName="projectileTime"
                        {...numberPropsFromDefinition(getVariableInfo('projectileTime'))}
                        formatValue={(v) => `${v} s`}
                    />
                    {" → Height: "}<ReactiveHeight />
                </EditableParagraph>
            </Block>
            <Block id="projectile-key-values" padding="sm">
                <EditableParagraph id="para-projectile-key-values" blockId="projectile-key-values">
                    Max height: <ReactiveMaxHeight /> · Total time: <ReactiveTotalTime />
                </EditableParagraph>
            </Block>
        </div>
        <Block id="projectile-visualization" padding="sm" hasVisualization>
            <ProjectileVisualization />
        </Block>
    </SplitLayout>,

    // Assessment
    <StackLayout key="layout-realworld-question" maxWidth="xl">
        <Block id="realworld-question" padding="md">
            <EditableParagraph id="para-realworld-question" blockId="realworld-question">
                <strong>Final check:</strong> With v₀ = 20 m/s and g = 10 m/s²,
                max height = v₀²/(2g) ={" "}
                <InlineFeedback
                    varName="answerMaxHeight"
                    correctValue="20"
                    position="terminal"
                    successMessage="— correct! (20)²/20 = 20 m"
                    failureMessage="— try again"
                    hint="Calculate (20)²/(2×10)"
                    visualizationHint={{
                        blockId: "projectile-visualization",
                        hintKey: "projectile-max-height-hint",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the ball to the top of the arc",
                                position: { x: "40%", y: "25%" },
                                completionVar: "projectileTime",
                                completionValue: 2,
                                completionTolerance: 0.3,
                            }
                        ],
                        label: "Check the graph",
                        resetVars: { projectileVelocity: 20, projectileTime: 0 },
                    }}
                >
                    <InlineClozeInput
                        varName="answerMaxHeight"
                        correctAnswer="20"
                        {...clozePropsFromDefinition(getVariableInfo('answerMaxHeight'))}
                    />
                </InlineFeedback>
                {" "}m.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Conclusion
    <StackLayout key="layout-conclusion" maxWidth="xl">
        <Block id="conclusion" padding="md">
            <EditableParagraph id="para-conclusion" blockId="conclusion">
                <strong>Well done!</strong> You now understand how quadratic functions describe
                parabolas, how coefficients control their shape, and how to apply them to real problems.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
