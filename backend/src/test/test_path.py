import os

import matplotlib.pyplot as plt
import networkx as nx
import osmnx as ox
import pytest
from haversine import haversine
from src.modules.pathfinding.osm_util import *


def test_get_map():
    origin = (42.37506,-72.52145)
    G, center = get_graph(origin)
    node = ox.nearest_nodes(G, origin[1], origin[0])
    assert haversine((G.nodes[node]['y'], G.nodes[node]['x']), origin) < 0.1

def test_save_map():
    origin = (42.37506,-72.52145)
    G, center = get_graph(origin)
    save_graph(G, center)
    assert f"{center[1]}_{center[0]}.graphml" in os.listdir("/maps")
    os.remove(f"/maps/{center[1]}_{center[0]}.graphml")
    assert f"{center[1]}_{center[0]}.graphml" not in os.listdir("/maps")

def test_get_save_get_nearby():
    origin = (9.91907, 8.88934)#random point i figured no one would realistically request, not that it matters if they do
    testG, testC = get_graph(origin)
    save_graph(testG, testC)
    G, center = get_graph((origin[0] - 0.0006, origin[1]))
    print(haversine(center, testC))
    os.remove(f"/maps/{center[1]}_{center[0]}.graphml")
    assert center == testC
    assert nx.weisfeiler_lehman_graph_hash(testG) == nx.weisfeiler_lehman_graph_hash(G)

def test_add_elevation():
    origin = (-13.1635832, -72.5449133)#machu piccu
    G, center = get_graph(origin)
    node = ox.nearest_nodes(G, center[1], center[0])
    add_elevation(G)
    assert "elevation" in G.nodes[node] and G.nodes[node]["elevation"] > 2000