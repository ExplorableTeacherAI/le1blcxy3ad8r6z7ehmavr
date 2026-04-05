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

// ── Reactive Projectile Motion Visualization ──────────────────────────────────
function ProjectileVisualization() {
    const t = useVar('projectileTime', 1) as number;
    const v0 = useVar('projectileVelocity', 20) as number;
    const setVar = useSetVar();

    // Physics: h(t) = v0*t - 0.5*g*t² (simplified, starting from ground level)
    const g = 10; // gravity (m/s²)

    // Height function
    const height = (time: number) => v0 * time - 0.5 * g * time * time;

    // Calculate key values
    const maxTime = (2 * v0) / g; // Time when ball lands
    const maxHeightTime = v0 / g; // Time at maximum height
    const maxHeight = height(maxHeightTime);
    const currentHeight = Math.max(0, height(t));

    // Ball position at current time
    const ballX = t;
    const ballY = currentHeight;

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
                    // Max height horizontal line
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
                        color: "#ef4444",
                        constrain: (point) => {
                            // Constrain to the trajectory curve
                            const time = Math.max(0, Math.min(maxTime, point[0]));
                            const h = Math.max(0, height(time));
                            return [time, h];
                        },
                        onChange: (point) => {
                            const newTime = Math.round(point[0] * 10) / 10;
                            setVar('projectileTime', Math.max(0, Math.min(maxTime, newTime)));
                        },
                    },
                ]}
            />
            <InteractionHintSequence
                hintKey="projectile-drag"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the red ball along the trajectory to see height at different times",
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
    const g = 10;
    const maxHeight = (v0 * v0) / (2 * g);
    return <span style={{ color: '#F7B23B', fontWeight: 600 }}>{maxHeight.toFixed(1)} m</span>;
}

function ReactiveMaxTime() {
    const v0 = useVar('projectileVelocity', 20) as number;
    const g = 10;
    const maxTime = v0 / g;
    return <span style={{ color: '#8E90F5', fontWeight: 600 }}>{maxTime.toFixed(1)} s</span>;
}

function ReactiveTotalTime() {
    const v0 = useVar('projectileVelocity', 20) as number;
    const g = 10;
    const totalTime = (2 * v0) / g;
    return <span style={{ color: '#AC8BF9', fontWeight: 600 }}>{totalTime.toFixed(1)} s</span>;
}

// ── Section Blocks ────────────────────────────────────────────────────────────

export const realWorldApplicationsBlocks: ReactElement[] = [
    // Section heading
    <StackLayout key="layout-realworld-title" maxWidth="xl">
        <Block id="realworld-title" padding="md">
            <EditableH2 id="h2-realworld-title" blockId="realworld-title">
                Real-World Applications: Projectile Motion
            </EditableH2>
        </Block>
    </StackLayout>,

    // Introduction
    <StackLayout key="layout-realworld-intro" maxWidth="xl">
        <Block id="realworld-intro" padding="sm">
            <EditableParagraph id="para-realworld-intro" blockId="realworld-intro">
                Remember the basketball from the beginning of this lesson? Its path through the air
                follows a quadratic function. In fact, any object thrown upward (ignoring air resistance)
                follows a{" "}
                <InlineTooltip
                    id="tooltip-parabolic-path"
                    tooltip="The curved path an object takes when thrown or launched, shaped by gravity."
                >
                    parabolic trajectory
                </InlineTooltip>
                . Let's explore the mathematics behind this motion.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // The height equation
    <StackLayout key="layout-height-equation-heading" maxWidth="xl">
        <Block id="height-equation-heading" padding="sm">
            <EditableH3 id="h3-height-equation-heading" blockId="height-equation-heading">
                The Height Equation
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-height-explanation" maxWidth="xl">
        <Block id="height-explanation" padding="sm">
            <EditableParagraph id="para-height-explanation" blockId="height-explanation">
                When you throw a ball straight up with initial velocity v₀, its height at time t
                is given by a quadratic function. Gravity constantly pulls the ball downward,
                causing it to slow down, stop at its maximum height, and then fall back down.
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

    <StackLayout key="layout-formula-meaning" maxWidth="xl">
        <Block id="formula-meaning" padding="sm">
            <EditableParagraph id="para-formula-meaning" blockId="formula-meaning">
                Here,{" "}
                <InlineSpotColor varName="projectileVelocity" {...spotColorPropsFromDefinition(getVariableInfo('projectileVelocity'))}>
                    v₀
                </InlineSpotColor>
                {" "}is the initial upward velocity and{" "}
                <span style={{ color: '#ef4444', fontWeight: 600 }}>g</span>
                {" "}is the acceleration due to gravity (about 10 m/s²). Notice this is a quadratic
                in t with a negative coefficient on t², which is why the parabola opens downward.
            </EditableParagraph>
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
                    Time elapsed:{" "}
                    <InlineScrubbleNumber
                        varName="projectileTime"
                        {...numberPropsFromDefinition(getVariableInfo('projectileTime'))}
                        formatValue={(v) => `${v} s`}
                    />
                    <br /><br />
                    Current height: <ReactiveHeight />
                </EditableParagraph>
            </Block>
            <Block id="projectile-key-values" padding="sm">
                <EditableParagraph id="para-projectile-key-values" blockId="projectile-key-values">
                    <strong>Key values:</strong>
                    <br /><br />
                    Maximum height (vertex): <ReactiveMaxHeight />
                    <br />
                    Time to reach max height: <ReactiveMaxTime />
                    <br />
                    Total flight time: <ReactiveTotalTime />
                </EditableParagraph>
            </Block>
        </div>
        <Block id="projectile-visualization" padding="sm" hasVisualization>
            <ProjectileVisualization />
        </Block>
    </SplitLayout>,

    // Connection to quadratics
    <StackLayout key="layout-connection-heading" maxWidth="xl">
        <Block id="connection-heading" padding="sm">
            <EditableH3 id="h3-connection-heading" blockId="connection-heading">
                Connecting to What We Learned
            </EditableH3>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-connection-explanation" maxWidth="xl">
        <Block id="connection-explanation" padding="sm">
            <EditableParagraph id="para-connection-explanation" blockId="connection-explanation">
                This projectile problem uses everything we learned about quadratics. The vertex
                tells us the maximum height and when it occurs. The x-intercepts (when h = 0)
                tell us when the ball is at ground level — at t = 0 when it's thrown, and at
                the total flight time when it lands. The coefficient of t² is negative, so
                the parabola opens downward, exactly as we expect for something that goes up
                and then comes back down.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Finding max height formula
    <StackLayout key="layout-max-height-formula" maxWidth="xl">
        <Block id="max-height-formula" padding="sm">
            <EditableParagraph id="para-max-height-formula" blockId="max-height-formula">
                Using the vertex formula from earlier, the maximum height occurs at
                t = v₀/g, and the maximum height itself is h = v₀²/(2g). Try changing the
                initial velocity and verify that these formulas match the values shown.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    // Assessment question
    <StackLayout key="layout-realworld-question" maxWidth="xl">
        <Block id="realworld-question" padding="md">
            <EditableParagraph id="para-realworld-question" blockId="realworld-question">
                <strong>Final challenge:</strong> A ball is thrown upward with an initial velocity of 20 m/s.
                Using the formula h = v₀²/(2g) with g = 10 m/s², what is the maximum height reached?
                h ={" "}
                <InlineFeedback
                    varName="answerMaxHeight"
                    correctValue="20"
                    position="terminal"
                    successMessage="— excellent! You calculated (20)²/(2×10) = 400/20 = 20 m"
                    failureMessage="— not quite"
                    hint="Substitute v₀ = 20 and g = 10 into the formula: h = (20)²/(2×10)"
                    visualizationHint={{
                        blockId: "projectile-visualization",
                        hintKey: "projectile-max-height-hint",
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the ball to the top of the arc to see the maximum height",
                                position: { x: "40%", y: "25%" },
                                completionVar: "projectileTime",
                                completionValue: 2,
                                completionTolerance: 0.3,
                            }
                        ],
                        label: "Check it on the graph",
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
                <strong>Congratulations!</strong> You've explored the fascinating world of quadratic
                functions. From basketball shots to mathematical formulas, you now understand how
                parabolas work, what controls their shape, and how to use them to solve real problems.
                The next time you see a fountain, a bridge, or a ball in flight, you'll recognize
                the quadratic functions at work.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
