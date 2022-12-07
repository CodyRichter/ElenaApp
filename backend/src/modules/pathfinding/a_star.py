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
                gain = 0
                # Debug stuff for elevation testing
                #prev = shortest_path_ids[0]
                #for pt in shortest_path_ids:
                #    if 'elevation' in self._routing_strategy.graph.nodes[pt]:
                #        gain += max(self._routing_strategy.graph.nodes[pt]['elevation'] - self._routing_strategy.graph.nodes[prev]['elevation'], 0)
                #print("total gain:", gain)
                return shortest_path_coords, costs[end]
            
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
        add_elevation(graph)
    
    def heuristic(self, node, target):
        n1 = (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
        n2 = (self.graph.nodes[target]['y'], self.graph.nodes[target]['x'])
        hav = haversine(n1, n2)
        
        e1 = self.graph.nodes[node]['elevation']
        e2 = self.graph.nodes[target]['elevation']
        if(e1 < e2):
            # we have to go uphill at some point, penalize
            #return math.sqrt(hav**2 + (e2-e1)**2)#distance including elevation
            hav += 10*(e2 - e1)
        return hav # dont reward for downhill
    
    def weight(self, node1, node2, edge_attrs):
        n1 = (self.graph.nodes[node1]['y'], self.graph.nodes[node1]['x'])
        n2 = (self.graph.nodes[node2]['y'], self.graph.nodes[node2]['x'])
        hav = haversine(n1, n2)
        
        e1 = self.graph.nodes[node1]['elevation']
        e2 = self.graph.nodes[node2]['elevation']
        if(e1 < e2):
            #return math.sqrt(hav**2 + (e2-e1)**2)#distance including elevation
            hav += 10*(e2 - e1)
        return hav # dont reward for downhill

class MaximizeStrategy(RoutingStrategy):
    def __init__(self, graph, max_dist):
        super().__init__(graph, max_dist)
        add_elevation(graph)
    
    def heuristic(self, node, target):
        n1 = (self.graph.nodes[node]['y'], self.graph.nodes[node]['x'])
        n2 = (self.graph.nodes[target]['y'], self.graph.nodes[target]['x'])
        hav = haversine(n1, n2)
        
        e1 = self.graph.nodes[node]['elevation']
        e2 = self.graph.nodes[target]['elevation']
        #if(e2 < e1):
        #    return math.sqrt(hav**2 + (e1-e2)**2)#distance including elevation drop1
        return math.sqrt(hav**2 + (max(e1-e2, 0))**2) #max because if downhill, then it will lose negative and thus reward
    
    def weight(self, node1, node2, edge_attrs):
        n1 = (self.graph.nodes[node1]['y'], self.graph.nodes[node1]['x'])
        n2 = (self.graph.nodes[node2]['y'], self.graph.nodes[node2]['x'])
        hav = haversine(n1, n2)
        
        e1 = self.graph.nodes[node1]['elevation']
        e2 = self.graph.nodes[node2]['elevation']
        return math.sqrt(hav**2 + (max(e1-e2, 0))**2) #max because if downhill, then it will lose negative and thus reward

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