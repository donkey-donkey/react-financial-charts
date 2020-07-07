import * as React from "react";
import {
    colorToRGBA,
    getAxisCanvas,
    getStrokeDasharrayCanvas,
    GenericChartComponent,
    strokeDashTypes,
} from "@react-financial-charts/core";

interface StraightLineProps {
    readonly className?: string;
    readonly type?: "vertical" | "horizontal";
    readonly stroke?: string;
    readonly strokeWidth?: number;
    readonly strokeDasharray?: strokeDashTypes;
    readonly opacity: number;
    readonly yValue?: number;
    readonly xValue?: number;
}

export class StraightLine extends React.Component<StraightLineProps> {
    public static defaultProps = {
        className: "line",
        type: "horizontal",
        stroke: "#000000",
        opacity: 0.5,
        strokeWidth: 1,
        strokeDasharray: "Solid",
    };

    public render() {
        return <GenericChartComponent canvasDraw={this.drawOnCanvas} canvasToDraw={getAxisCanvas} drawOn={["pan"]} />;
    }

    private readonly drawOnCanvas = (ctx: CanvasRenderingContext2D, moreProps) => {
        const {
            type,
            stroke = StraightLine.defaultProps.stroke,
            strokeWidth = StraightLine.defaultProps.strokeWidth,
            opacity,
            strokeDasharray,
            yValue,
            xValue,
        } = this.props;

        const {
            xScale,
            chartConfig: { yScale, width, height },
        } = moreProps;

        ctx.beginPath();

        ctx.strokeStyle = colorToRGBA(stroke, opacity);
        ctx.lineWidth = strokeWidth;

        const { x1, y1, x2, y2 } = this.getLineCoordinates(type, xScale, yScale, xValue, yValue, width, height);

        const lineDash = getStrokeDasharrayCanvas(strokeDasharray);

        ctx.setLineDash(lineDash);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    };

    private readonly getLineCoordinates = (type, xScale, yScale, xValue, yValue, width, height) => {
        return type === "horizontal"
            ? { x1: 0, y1: Math.round(yScale(yValue)), x2: width, y2: Math.round(yScale(yValue)) }
            : { x1: Math.round(xScale(xValue)), y1: 0, x2: Math.round(xScale(xValue)), y2: height };
    };
}
