import React from "react";
import RoutingMachine from "./RoutingMachine";

type PositionProps = [number, number];

interface PathsProps {
    waypoints: PositionProps[];
}

export default function CreatePaths({ waypoints }: PathsProps) {
    const paths: JSX.Element[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
        paths.push(
            <RoutingMachine
                from_lat={waypoints[i][0]}
                from_long={waypoints[i][1]}
                to_lat={waypoints[i + 1][0]}
                to_long={waypoints[i + 1][1]}
            />
        );
    }

    return <div>{paths}</div>;
}
