from typing import List, Tuple

import osmnx as ox

try:
    graph = ox.load_graphml("Amherst.graphml")
except FileNotFoundError:
    graph = ox.graph_from_place("Amherst, Massachusetts, USA")
    ox.save_graphml(graph, "Amherst.graphml")

def a_star(origin: Tuple[float, float], dest: Tuple[float, float], mode: str, maxdist: int) -> List[Tuple[float, float]]:
    start = ox.nearest_nodes(graph, origin[1], origin[0])
    end = ox.nearest_nodes(graph, dest[1], dest[0])
    shortest_path_ids = ox.shortest_path(graph, start, end)
    shortest_path_coords = list(map(lambda id: (graph.node[id]['lat'], graph.node[id]['lon']), shortest_path_ids))
    print(shortest_path_coords)
    return shortest_path_coords