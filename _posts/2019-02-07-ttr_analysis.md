---
date: 2019-02-07
title: Playing Ticket to Ride like a computer programmer.
excerpt: "applying network theory analysis on the ticket to ride boardgame and finding best working strategies"
comments: true
header:
  overlay_image: http://www.progettogaming.it/wp-content/uploads/2016/12/577ee22e-b9c6-42a4-8eb7-22c9c360c4a0.jpg._CB329155359_.jpg
  show_overlay_excerpt: false
  overlay_filter: 0.5
  caption: ""
image_path: https://35sf8z1suehb4fodtv2gzxhu-wpengine.netdna-ssl.com/wp-content/uploads/blogs/Ticket-To-Ride-Germany-2.jpg
resources_dir: post_resources/ttr_analysis/
toc: true
toc_sticky: true
categories:
  - Data Stories
tags:
  - Ticket to Ride
  - Network Analysis
permalink: /data-stories/:title/
custom_js :
    - assets/custom/ttr_main.js
---

Ticket-to-ride board game is one of the good strategic games. It requires that players need lot of 
planning and strategy building in the process. But have you ever wondered how you could play this board game 
more efficiently ?. In this article, I will share some of the results of my computational analysis 
on Ticket-to-ride board game. Also I will discuss on how to build best strategies for this game. 
I will be using network theory and related concepts extensively here.

Before we proceed, let me clarify that this article is not to introduce the game or its rules to you, it is expected that the audience
of this article are familiar with the game. Anyways, for those of you who are unfamiliar about the game and its rules, visit this page
[Ticket to Ride Wiki](https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)){:target="_blank"}

## Building the structure

We will be using the popular python package [`networkx`](https://networkx.github.io/){:target="_blank"} to build the graph structures. To fit in the current
context, cities are represented as nodes and segments between cities can be represented as edges. 
Then we construct the network using the below code. 

```python
# construct graph
import os
import re
import networkx as nx
import pandas as pd
import json
import math

# function to calculate points from segment length
def points(distance):
    x = [0, 1, 2, 4, 7, 0, 15, 0, 21]
    return x[distance]

pattern = re.compile('\\w+')

# we need a multigraph as we know from the game that there are multiple edges between certain cities
Gm = nx.MultiGraph()

Gm.clear()
with open(routes_path) as f:
    for line in f:
        city1, city2, distance, route_type, color, is_multi = pattern.findall(line)
        distance = int(distance)
        if(Gm.has_edge(city1,city2)==False):
            Gm.add_edge(city1, city2, key=0, distance=distance, route_type=route_type, color=color, points=points(distance), 
                   weight=distance, importance=0)
```


It can be observed from the Chart-1 (below) that the cities with maximum degree are `Paris, Frankfurt and Kyiv` as indicated by
their corresponding node sizes.

{% include_relative post_resources/ttr_analysis/node_network.html %}


## Basic Stats

From the degree distribution as shown in Chart-2a (below), it can be observed that degree of all cities ranges between `1-7`. A big chunk nearly `31.9%`
of cities have a degree `4` while about `29%` of cities have a degree `3`. There is only one city with maximum degree of `7` while there are two cities
with degree `6.` Also we can observe from Chart-2b (below) that `36%` of edges have a weight `2`, `28%` of edges have a weight of `4` and `27%` of edges have weight `3.`
There is only 1 edge with weight `8` which runs between `Petrograd-Stockholm.` Just by claiming this route you can buckle up `21` points.

{% include_relative post_resources/ttr_analysis/degree_weight_dist.html %}
<br/><br/>

As expected, the level of difficulty of this game increases as the number of players increase.
This is evident from the below ratios. For e.g, in a 3-player game only `10%` of cities
have a degree less than `3` which means blocking other players is difficult so that would be an easy game for each player involved. However blocking probabilities
are more in 4-player and 5-player games. In a 5-player game, huge number of cities nearly `72%` have a degree less than `5` which means there is more
room for blocking strategies by other players hence the game becomes more difficult.

```python
# fraction of nodes with degree < 3
len(degree_df[degree_df.degree<3])/len(degree_df)*100
```
```console
10.638297872340425
```

```python
# fraction of nodes with degree < 4
len(degree_df[degree_df.degree<4])/len(degree_df)*100
```
```console
40.42553191489361
```

```python
# fraction of nodes with degree < 5
len(degree_df[degree_df.degree<5])/len(degree_df)*100
```
```console
72.3404255319149
```
<br/><br/>
Chart-3 (below) shows the destination card points distribution. 
It can be observed that there are very few long routes about `3 cards` with `20 points` and 
another `3 cards` with `21 points`. A vast number of cards are short routes with a big chunk 
about `13 cards` fetch `8 points` each.

{% include_relative post_resources/ttr_analysis/destination_card_points_dist.html %}
<br/><br/>

Let us now define some common properties of network:
*  **_radius_** is the minimum number of edges needed to connect the most central node (city) to all others.
* **_diameter_** is the minimum number of edges that will connect the two nodes that are far apart.
* **_eccentricity_** is the maximum distance from a given node to all other nodes. Lower value of eccentricity means that the node is relatively closer to the center of network while the higher value of eccentricity
  means that the node is relatively far from the center of the network.
* **_center_** of the network is the set of nodes whose eccentricity equals the radius of the network. There are 3 cities (listed below) at the center
  of the network. From all of these cities it is relatively easy to reach any part of the network.
* **_periphery_** of the network is the set of nodes whose eccentricity equals the diameter of the network. There are 7 cities (listed below) at
  the periphery of the network. From each of these cities, it is relatively difficult to reach to the further part of the network.

All of the above properties can be deduced from the network as shown below,
 
```python
nx.radius(G)
```
```console
5
```
```python
nx.diameter(G)
```
```console
9
```
```python
# ecc is the dictionary of nodes and their respective eccentricities.
ecc = nx.eccentricity(G)
```
```python
nx.center(G)
```
```console
['Berlin', 'Venezia', 'Munchen']
```
```python
nx.periphery(G)
```
```console
['Lisboa', 'Cadiz', 'Edinburgh', 'Erzurum', 'Sochi', 'Rostov', 'Moskva']
```
For your reference, all cities with maximum and minimum eccentricities are listed in <a href="#citiesTable">Table-1</a>
<br/>

Based on the above properties, we can make the following inferences:
* Its a good strategy to start your game by claiming routes around the cities at the center such as `Berlin,Venezia,Munchen` because its relatively easy to reach whatever direction you wish to continue as the game unfolds.
* It is a good strategy to choose destination cards including any periphery cities such as `Lisboa,Cadiz,Edinburgh,Erzurum,Sochi,Rostov,Moskva`. Having one or more of these in your control increases your chances of building the longest route. Your best bet would be to have two such cities but at the
opposite ends of the network. 
* Listed below are all those routes from periphery cities with length equal to diameter. Considering these in your plan would
be a smart strategy especially if you are on building the longest route.

```console
Lisboa-Madrid-Barcelona-Marseille-Roma-Palermo-Smyrna-Angora-Erzurum-Sochi
Lisboa-Madrid-Barcelona-Marseille-Roma-Palermo-Smyrna-Constantinople-Sevastopol-Rostov
Lisboa-Madrid-Pamplona-Paris-Frankfurt-Essen-Kobenhavn-Stockholm-Petrograd-Moskva
Cadiz-Madrid-Barcelona-Marseille-Roma-Palermo-Smyrna-Angora-Erzurum-Sochi
Cadiz-Madrid-Barcelona-Marseille-Roma-Palermo-Smyrna-Constantinople-Sevastopol-Rostov
Cadiz-Madrid-Pamplona-Paris-Frankfurt-Essen-Kobenhavn-Stockholm-Petrograd-Moskva
Edinburgh-London-Dieppe-Paris-Marseille-Roma-Palermo-Smyrna-Angora-Erzurum
Edinburgh-London-Amsterdam-Essen-Berlin-Warszawa-Kyiv-Bucuresti-Sevastopol-Sochi
```

## Importance of some cities

Certainly some cities are more important than others. This can be measured with variety of centrality measures, clustering coefficient, connectivity and efficiency.

These properties are defined below:
* **_Degree centrality_** for a node is the fraction of nodes connected to it. 
* **_Betweenness centrality_** of a node is the sum of the fraction of all-pairs shortest paths that pass through it.
* **_Closeness centrality_** of a node is the reciprocal of the sum of the shortest path distances from the current node to all other nodes.
* **_Clustering coefficient_** of a node is the ratio of number of connections in the neighborhood of a node and the number of connections if the neighborhood was fully connected.
  This ratio tells how well connected the neighborhood of the node is. If the neighborhood is fully connected, the clustering coefficient is 1 and a value close to 0 means that there are hardly any connections in the neighborhood.
* **_connectivity_** of a node is the minimum number of nodes required to be removed to block out all the paths to the subject node. The higher value is better.

All the above properties can be deduced from the network as below:
```python
# values returned are dictionary of nodes with their respective values for the speicifed property
dc = nx.degree_centrality(G)
cc = nx.closeness_centrality(G, distance='weight')
bc = nx.betweenness_centrality(G, weight='weight')
ccoef = nx.clustering(G)
```

The table below (Table-1) lists all of the above discussed properties for every node (city). 
<br/>
{% include_relative post_resources/ttr_analysis/table1.html %}
<br/><br/>
Below are few observations we can make from the above table:
* Based on degree centrality, cities `Paris, Kyiv, Frankfurt` have higher values where as cities `Ediburgh, Cadiz, Lisboa, Kobenhavn` 
have lower value. Lower value of this measure means that you need to be more cautious around those cities because there is a high
probability that you may be blocked from those cities. 
* Based on betweenness centrality, cities `Frankfurt, Wien, Budapest` have higher values where as cities such as 
`Brest, Palermo, Cadiz` have lowest values. The higher value of this measure means that there are more shortest paths passing through those cities hence
there will be more competition for routes passing through those cities. More competition again leads to blockage so you need to watch out these cities if you have any of them in your plan.
* Based on closeness centrality, cities `Wien, Munchen, Budapest` have higher values so it is relatively easy from these to reach far ends of the network quite easily. where as cities `Cadiz, Lisboa, Edinburgh` have lower value so it is relatively
difficult to reach the far ends from these cities.
* Based on clustering coefficient values, it is evident that the neighborhoods of cities such as `Lisboa, Cadiz, Sochi, Barcelona, Brest` 
are quite strong so even if your opponent tries to block you in one route, you will certainly be able to find your way out and move on. 
However you need to be more cautious for cities such as `Edinburgh, Moskva, Stockholm, Kharkov, Kobenhavn. London` because their neighborhood is not strong and you may be blocked out.

Apart from centrality measures and clustering, we can measure each city's importance by certain attacking strategies.
Importance of anything is better known only when its gone. So, we can iteratively remove one city at a time from the network and measure the
change in certain properties such as connectivity, efficiency etc. Removing a city in this context means that your opponents have claimed all routes
around that city and you are blocked out with respect to that city. Table-2 (below) shows the details about the impact caused.
<br/>
{% include_relative post_resources/ttr_analysis/table2.html %}
<br/><br/>
Below are few observations we can make from the above table:
* It can be observed that the network pretty much stays connected when you remove any city except for `London` and `Madrid.` When you remove `London`, `Edinburgh` 
becomes unreachable and when you remove `Madrid`, both `Lisboa` and `Cadiz` becomes unreachable from else where. So, if you are 
interested in either of these cities, you better watch out `London` or `Madrid.`
* Its interesting to know that removing `Essen` raises the overall average cost to build a route by `+8.24%`. If you claimed all routes
leading to this city, you would significantly affect all of your opponents as their cost to build increases and consequently their game 
will be slightly delayed. However its not good for you if the situation is other way around. 
* Another interesting observation is that absence of `Marsielle` reduces the average connectivity by `-10.35%` which again is not good for your opponents as 
they become more vulnerable for blockage. 

## Importance of some edge segments

In the context of the game, its relatively hard that anyone gets blocked out for a city but its fairly easy to get blocked out on a route segment hence
knowing the importance of certain edge segments is more useful in this game. The importance of each route segment can be gauged by edge betweenness centrality,
and change in factors such as average connectivity, average clustering coefficient, efficiency.

The table below lists out top 10 and bottom 10 cities by their edge betweenness values,

{% include_relative post_resources/ttr_analysis/table3.html %}
<br/><br/>
Below are few observations we can make from the above table:
* It can be observed that `Budapest-Wien, Zagrab-Vienna, Wien-Munchen` have the high betweenness centrality. So, certainly there is
a big competition for these segments, so you need to catch up on them relatively sooner if at all they are in your plan. 
* However, for segments such as `Rome-Venezia, Barcelona-Marsielle`, you need not stress much because their lower value of betweenness score indicates lesser 
competition.

From the table below we can understand the impact caused by removing a particular edge segment.  
{% include_relative post_resources/ttr_analysis/table4.html %}
<br/><br/>
Below are few observations we can make from the above table:
* You can observe that the network is only disconnected when you remove the edge `London-Edinburgh` and when that happens only `Edinburgh` becomes unreachable. However the network
is not impacted by any other edges.
* When `Kobenhavn-Essen` goes out of picture, the average shortest path cost increases by `7.34%.`
* It can be observed that average connectivity is considerably impacted by almost every edge removal with most impact caused by removing the edge `Rostov-Kharkov` when 
average connectivity drops by `8.47%.`
* The neighborhood also is deeply affected when you remove edges such as `Lisboa-Cadiz, Cadiz-Madrid, Lisboa-Madrid` which is evident from the huge drops in the network's average
clustering coefficient  values.
* Also, the efficiency drop of `2.81%` is caused when you remove the edge `London-Edinburgh.`

## Destination Card Profitability Analysis

What if you know the art of picking the right cards ?. Of course, that is quite possible but only if you know the underlying numbers. 
Listed below are all destination card routes with their shortest path characteristics.

{% include_relative post_resources/ttr_analysis/table5.html %}
<br/><br/>
Below are few observations we can make from the above table:
* It can be observed that all long routes (card points >=20) fetch you around 50-54 final points if you get to do the shortest paths. You still will be left out with nearly half of
your locomotives besides doing shortest path in one of these routes because it costs you only around 20-21 locomotives at the max.
* Also its interesting to know that the route `Edinburgh-Athina (21)` may seem more attractive over `Lisboa-Danzig (20)` because of the extra card point but
the shortest path of `Lisboa-Danzig` will fetch you `50` points where as `Edinburgh-Athina` fetches you only `48` points. This is in fact more evident in
the `shorest path profitability` ratio which essentially explains how profitable is that route. It is simply the ratio of total final points and the cost for it which is the
number of locomotives you used to build that route. Also from the table, its evident that the most profitable shortest path route is `Palermo-Constantinople` which
would cost you only `8` locomotives for a return of `25` points. That would be a good short route card to grab besides one long route.
* Another interesting factor to look at is the `connectivity` which in this case applies for all the associated route. It indicates the minimum number of edges to remove 
for blocking out all paths between a given source and destination nodes. The higher it is the better. It can be observed that `Berlin-Bucuresti` is by far
the most robust route because it takes `5` edges for anyone to block you out. In the longer routes, `Edinburgh-Athina, Kobenhavn-Erzurum, Cadiz-Stockholm` are more
vulnerable for blockage because fo their lower edge connectivity values. So, you got to play with more caution if you were to do any of these routes.

## Alternate Scoring Strategies

On any route, shortest path completion requires least number of locomotives but does not necessarily fetch you maximum points. During the
coarse of the game, its quite common for the players to make slight detours especially for gaining few extra points. 

Let us analyze the route `Palermo-Moskva` in more detail. From <a href="#spTable">Table-5</a> we can see that the shortest path for the route `Palermo-Moskva` 
fetches you a total of `54` points at the cost of `20 locomotives.`  However, if you have more time, you are more likely to plan a detour for gaining extra points. 
So how do you do that? Well, here you need to carefully consider various features associated with every alternate path so as to make good gains. 
For e.g, if there is not much time left in the game, you might want to select a path that has less `path length` because completing every segment of the path length costs 
you a turn. Also, you should be able to cover the cost of your selected path so `path cost` becomes important factor in selecting an optimal path sometimes. 
Sometimes, `path profitability` makes more sense especially when you want more return on your investment.

Deducing all the alternate routes between given source and destination requires finding all simple paths through out the network which 
could sometimes lead to an indefinite time especially for large networks. Hence we will only find all those alternate paths which are just 2 segments more 
than the shortest path which simplifies our process. Below is the code fragment which essentially does that. 

```python
# return all paths between u and v in graph g up to distance min(u,v)+2
def alternate_scoring_paths_with_cutoff(g, u, v):
    sp_length = nx.shortest_path_length(g,u,v)
    paths = nx.all_simple_paths(g, u, v, cutoff=sp_length+2)
    return list(paths)
```

Using the above method, we generate all the alternate paths for the route `Palermo-Moskva` and the related results are listed below in 
<a href="#alternateScoringTable">Table-6.</a> You can carefully analyze below paths and select the most optimal path depending on your criteria.
Similarly alternate paths can be deduced for any given route.
   
{% include_relative post_resources/ttr_analysis/table6.html %}

## Blocking Strategies

In the previous section, we have seen alternate scoring strategies. However you need to be aware of what it takes for others to block you to complete your 
desired route. Using `Mininum edge cut` for any route, we can find out the list of most critical edges if all are blocked would mean that you cannot complete that route.

For example for the same route discussed above `Palermo-Moskva,` it takes 3 edges for anyone to knock you down. 
In other words, it essentially means that you need make smart choices to build on these edges relatively sooner and leaving less chance for others to block you.

```python 
for min_cut in list(nx.minimum_edge_cut(G,'Palermo','Moskva')):
    print(min_cut)
``` 
```console
('Petrograd', 'Moskva')
('Kharkov', 'Moskva')
('Smolensk', 'Moskva')
```

We have seen from <a href="#spTable">Table-5</a> that the most robust routes are `Berlin-Bucurest` and `Paris-Wien` because it takes 5 turns for anyone to block on these. 
```python
for min_cut in list(nx.minimum_edge_cut(G,'Bucuresti','Berlin')):
    print(min_cut)  
```
```console
('Frankfurt', 'Berlin')
('Danzig', 'Berlin')
('Essen', 'Berlin')
('Wien', 'Berlin')
('Warszawa', 'Berlin')
```
```python
for min_cut in list(nx.minimum_edge_cut(G,'Paris','Wien')):
    print(min_cut)
```
```console
('Munchen', 'Wien')
('Berlin', 'Wien')
('Budapest', 'Wien')
('Warszawa', 'Wien')
('Zagrab', 'Wien')
```

Also, the most vulnerable route is `Edinburgh-Athina` because it takes only 1 edge for anyone to block you completely.
```python
for min_cut in list(nx.minimum_edge_cut(G,'Edinburgh','Athina')):
    print(min_cut)  
```
```console
('Edinburgh', 'London')
```

## Code 

All the code used in this analysis can be downloaded from this [github repository](https://github.com/genielab/network_analysis_ticket_to_ride)

<br/>