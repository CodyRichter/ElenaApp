import abc
from typing import List, Tuple

import networkx as nx
import osmnx as ox
from haversine import haversine

try:
    graph = ox.load_graphml("Amherst.graphml")
except FileNotFoundError:
    graph = ox.graph_from_place("Amherst, Massachusetts, USA")
    ox.save_graphml(graph, "Amherst.graphml")

class AStar:
    def __init__(self, routing_strategy: "RoutingStrategy"):
        self._routing_strategy = routing_strategy

    @property
    def routing_strategy(self) -> "RoutingStrategy":
        return self._routing_strategy
    
    @routing_strategy.setter
    def routing_strategy(self, routing_strategy: "RoutingStrategy"):
        self._routing_strategy = routing_strategy
    
    def get_route(self, origin: Tuple[float, float], dest: Tuple[float, float]) -> Tuple[List[Tuple[float, float]], float]:
        start = ox.nearest_nodes(graph, origin[1], origin[0])
        end = ox.nearest_nodes(graph, dest[1], dest[0])

        shortest_path_ids = nx.astar_path(
            self._routing_strategy.graph,
            start,
            end,
            self._routing_strategy.heuristic,
            self._routing_strategy.weight
            )
        shortest_path_coords = list(map(
            lambda id: (
                self._routing_strategy.graph.nodes[id]['y'],
                self._routing_strategy.graph.nodes[id]['x']
                ),shortest_path_ids))
        
        prev = shortest_path_coords[0]
        dist = 0
        for pt in shortest_path_coords:
            dist += haversine(prev, pt)
            prev = pt
        return shortest_path_coords, dist


class RoutingStrategy(abc.ABC):
    def __init__(self, graph, max_dist):
        self.graph = graph
        self.max_dist = max_dist

    @abc.abstractmethod
    def heuristic(self, node, target):
        raise NotImplementedError
    
    @abc.abstractmethod
    def weight(self, node1, node2, direction):
        raise NotImplementedError

class DirectStrategy(RoutingStrategy):
    def __init__(self, graph, max_dist):
        super().__init__(graph, max_dist)
    
    def heuristic(self, node, target):
        n1 = (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
        n2 = (self.graph.nodes[target]['y'], self.graph.nodes[target]['x'])
        return haversine(n1, n2)
    
    def weight(self, node1, node2, edge_attrs):
        #ignore edge attributes for now
        n1 = (self.graph.nodes[node1]['y'], self.graph.nodes[node1]['x'])
        n2 = (self.graph.nodes[node2]['y'], self.graph.nodes[node2]['x'])
        return haversine(n1, n2)

def getStrategy(mode: str, max_dist: int) -> RoutingStrategy:
    if mode == "direct":
        return DirectStrategy(graph, max_dist)
    elif mode == "maximize_elevation":
        raise NotImplementedError
    elif mode == "minimize_elevation":
        raise NotImplementedError
    else:
        raise RuntimeError(f"Invalid mode: {mode}")

a_star_router = AStar(None)