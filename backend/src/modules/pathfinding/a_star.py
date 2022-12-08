import abc
import heapq
import math
from typing import List, Tuple

import networkx as nx
import osmnx as ox
from haversine import haversine
from src.modules.pathfinding.osm_util import *

try:
    graph = ox.load_graphml("Amherst.graphml")
except FileNotFoundError:
    graph = ox.graph_from_place("Amherst, Massachusetts, USA")
    add_elevation(graph)
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
        start = ox.nearest_nodes(self._routing_strategy.graph, origin[1], origin[0])
        end = ox.nearest_nodes(self._routing_strategy.graph, dest[1], dest[0])
        
        if callable(getattr(self._routing_strategy, "route", None)):
            # some strategies (maximum) will have a custom routing method
            # so override normal A* in that case
            shortest_path_ids = self._routing_strategy.route(start, end)
            shortest_path_coords = list(map(
                    lambda id: (
                        self._routing_strategy.graph.nodes[id]['y'],
                        self._routing_strategy.graph.nodes[id]['x']
                        ),shortest_path_ids))
            return shortest_path_coords, self._routing_strategy.route_length(shortest_path_ids, elevation=False)
        
        shortest_path_ids = []
        ## Begin A* stuff
        adj = self._routing_strategy.graph.adj
        queue = [(0, start)]
        costs = {start: 0}
        came_from = {start: None}
        

        while queue:
            _, cur = heapq.heappop(queue)

            if cur == end:
                # Reconstruct path
                shortest_path_ids = [cur]
                node = came_from[cur]
                while node is not None:
                    shortest_path_ids.append(node)
                    node = came_from[node]
                shortest_path_ids.reverse()

                # form return into function definition
                shortest_path_coords = list(map(
                    lambda id: (
                        self._routing_strategy.graph.nodes[id]['y'],
                        self._routing_strategy.graph.nodes[id]['x']
                        ),shortest_path_ids))
                return shortest_path_coords, self._routing_strategy.route_length(shortest_path_ids, elevation=False)
            
            for neighbor in adj[cur]:
                neighbor_cost = costs[cur] + self._routing_strategy.weight(cur, neighbor, None)
                if neighbor not in costs or neighbor_cost < costs[neighbor]:
                    came_from[neighbor] = cur
                    costs[neighbor] = neighbor_cost
                    fscore = neighbor_cost + self._routing_strategy.heuristic(neighbor, end)
                    heapq.heappush(queue, (fscore, neighbor))

        raise RuntimeError("NO PATH")


class RoutingStrategy(abc.ABC):
    def __init__(self, graph: networkx.MultiDiGraph, max_dist):
        self.graph = graph
        self.max_dist = max_dist

    @abc.abstractmethod
    def heuristic(self, node, target):
        raise NotImplementedError
    
    @abc.abstractmethod
    def weight(self, node1, node2, direction):
        raise NotImplementedError
    
    def route_length(self, route: list, elevation: bool = False) -> float:
        """Dynamically computes the distance of the route or elevation

        Does a 1-pass over route and calculates elevation gain (not delta) or distance
        depending on elevation bool input
        """
        acc = 0
        prev = route[0]
        comparator = (lambda e1, e2: max(e2 - e1, 0)) if elevation else haversine 
        for pt in route:
            if(elevation):
                n1 = self.graph.nodes[prev]['elevation']
                n2 = self.graph.nodes[pt]['elevation']
            else:
                n1 = (self.graph.nodes[pt]['y'], self.graph.nodes[pt]['x'])
                n2 = (self.graph.nodes[prev]['y'], self.graph.nodes[prev]['x'])
            acc += comparator(n1, n2)
            prev = pt
        return acc

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

class MinimizeStrategy(RoutingStrategy):
    def __init__(self, graph, max_dist):
        super().__init__(graph, max_dist)
    
    def heuristic(self, node, target):
        n1 = (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
        n2 = (self.graph.nodes[target]['y'], self.graph.nodes[target]['x'])
        hav = haversine(n1, n2)

        return hav 
    
    def weight(self, node1, node2, edge_attrs):
        e1 = self.graph.nodes[node1]['elevation']
        e2 = self.graph.nodes[node2]['elevation']

        return max(e2 - e1, 0)

class MaximizeStrategy(RoutingStrategy):
    def __init__(self, graph, max_dist):
        super().__init__(graph, max_dist)
    
    def heuristic(self, node, target):
        n1 = (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
        n2 = (self.graph.nodes[target]['y'], self.graph.nodes[target]['x'])
        hav = haversine(n1, n2)

        return hav

    def weight(self, node1, node2, edge_attrs):  
        n1 = (self.graph.nodes[node1]['y'], self.graph.nodes[node1]['x'])
        n2 = (self.graph.nodes[node2]['y'], self.graph.nodes[node2]['x'])
        hav = haversine(n1, n2)

        return hav
    
    def route(self, start, end) -> list[int]:
        # elevation maximizing algo, pretty complex
        # 1. Find and store direct path, as well as direct path length
        # 2. Iterate through each node of the direct path
        # 3. From each node (A), find the route to the next node (B) in the direct path with maximal length (within some total length constraint)
        # 4. Add every new node in between A->B
        # 5. Advance to next node C
        direct = nx.shortest_path(self.graph, start, end, self.weight)
        direct_len = self.route_length(direct, elevation=False)
        #store distance from every node to end of path
        direct_lens = [direct_len] * len(direct)
        for i in range(1, len(direct)):
            direct_lens[i] = direct_lens[i-1] - (self.heuristic(direct[i], direct[i-1]))
        max_length = (direct_len * self.max_dist) - direct_len # maximum amount of length we can add on
        new_path = []
        for i in range(len(direct) - 1):
            prev = direct[i]
            next_ = direct[i+1]

            max_elev_so_far = -1
            max_elev_path = []
            
            
            for path in nx.all_simple_paths(self.graph, prev, next_, 8):
                cur_elev = self.route_length(path, elevation=True)
                cur_dist = self.route_length(path, elevation=False)
                lim = max_length - direct_lens[i] # limit on how much the current node can increase distance-wise

                if cur_dist < lim and cur_elev > max_elev_so_far:
                    max_length -= cur_dist #subtract however much we just added on from our total limit
                    max_elev_so_far = cur_elev
                    max_elev_path = path
            new_path.extend(max_elev_path[:-1])
        new_path.append(end)
        return new_path
    

def getStrategy(mode: str, max_dist: int) -> RoutingStrategy:
    if mode == "direct":
        return DirectStrategy(graph, max_dist)
    elif mode == "maximize_elevation":
        return MaximizeStrategy(graph, max_dist)
    elif mode == "minimize_elevation":
        return MinimizeStrategy(graph, max_dist)
    else:
        raise RuntimeError(f"Invalid mode: {mode}")

a_star_router = AStar(None)