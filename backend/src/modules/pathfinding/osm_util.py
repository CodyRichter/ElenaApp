import logging
import os
from typing import Tuple

import networkx
import osmnx as ox
from haversine import haversine
from requests import get
from src.models.Constants import ELEVATION_URI

logger = logging.getLogger(__name__)


def add_elevation(G: networkx.MultiDiGraph) -> None:
    """Adds the elevation to each node in input graph G"""
    for k, v in G.nodes.items():
        if "elevation" in v:
            continue
        payload = {"locations": f"{v['y']},{v['x']}"}
        r = get(ELEVATION_URI, payload)
        if r.status_code not in {200, 201} or "elevation" not in r.json()["results"][0]:
            print(f"ERROR with node: {k} with data {v}")
            break

        logger.warning(f"RES: {r.status_code} {r.json()}")

        elevation = r.json()["results"][0]["elevation"]
        G.add_node(k, elevation=elevation)


def save_graph(G: networkx.MultiDiGraph, centerpoint: Tuple[float, float]) -> None:
    """Save graph to cache directory

    Saves graph to /maps/${centerpoint-lon}_${centerpoint-lat}.graphml
    """
    ox.save_graphml(G, f"/maps/{centerpoint[1]}_{centerpoint[0]}.graphml")


def get_graph(
    centerpoint: Tuple[float, float]
) -> Tuple[networkx.MultiDiGraph, Tuple[float, float]]:
    """Gets a graph centered at or around the requested centerpoint

    if the desired centerpoint is within some range of another already-computed map,
    then just load the other map
    """
    for f in os.listdir("/maps"):
        if f[-8:] == ".graphml":
            x, y = map(float, f.split(".graphml")[0].split("_"))
            diff = haversine((y, x), centerpoint)
            if diff < 0.1:
                # maps centered 0.1km or less from desired center
                return (ox.load_graphml(f"/maps/{f}"), (y, x))
    return (ox.graph_from_point(centerpoint), centerpoint)
