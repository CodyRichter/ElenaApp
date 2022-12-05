from typing import List, Tuple

import osmnx as ox
from haversine import haversine

try:
    graph = ox.load_graphml("Amherst.graphml")
except FileNotFoundError:
    graph = ox.graph_from_place("Amherst, Massachusetts, USA")
    ox.save_graphml(graph, "Amherst.graphml")

def a_star(origin: Tuple[float, float], dest: Tuple[float, float], mode: str, maxdist: int) -> Tuple[List[Tuple[float, float]], float]:
    start = ox.nearest_nodes(graph, origin[1], origin[0])
    end = ox.nearest_nodes(graph, dest[1], dest[0])
    shortest_path_ids = []
    if mode == "direct":
        shortest_path_ids = ox.shortest_path(graph, start, end)
    elif mode == "maximize_elevation":
        raise NotImplementedError
    elif mode == "minimize_elevation":
        raise NotImplementedError
    else:
        raise RuntimeError(f"Invalid mode: {mode}")
    shortest_path_coords = list(map(lambda id: (graph.nodes[id]['y'], graph.nodes[id]['x']), shortest_path_ids))
    prev = shortest_path_coords[0]
    dist = 0
    for pt in shortest_path_coords:
        dist += haversine(prev, pt)
        prev = pt
    return shortest_path_coords, dist