---
date: 2018-10-15 00:00:00+00:00
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

In this post, I will be sharing some of the results of my computational analysis on Ticket to ride board game.
Also I will discussing on how to build best strategies for this game. I will be using network theory and related concepts
extensively here.

This post does not introduce the game or its rules to you, it is expected that the audience
of this post are familiar with the game. Anyways, for those of you who are unfamiliar about the game and its rules, visit this page
[Ticket to Ride Wiki](https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game)){:target="_blank"}

### Building the structure

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


### Basic Stats

From the degree distribution as shown in Chart-2a (below), it can be observed that degree of all cities ranges between `1-7`. A big chunk nearly `31.9%`
of cities have a degree `4` while about `29%` of cities have a degree `3`. There is only one city with maximum degree of `7` while there are two cities
with degree `6.` Also we can observe from Chart-2b (below) that `36%` of edges have a weight `2`, `28%` of edges have a weight of `4` and `27%` of edges have weight `3.`
There is only 1 edge with weight `8` which runs between `Petrograd-Stockholm.` Just by claiming this route you can buckle up `21` points.

{% include_relative post_resources/ttr_analysis/degree_weight_dist.html %}

It can be observed from below ratios that the level of difficulty increases with the player count. For e.g, in a 3-player game only `10%` of cities
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
Chart-3 (below) gives us the overview of the destination card points distribution. It can be observed that there are very few long routes about `3 cards` with `20 points` and another `3 cards` with `21 points`. A vast number of cards are short routes with
a big chunk about `13 cards` fetch `8 points` each.

{% include_relative post_resources/ttr_analysis/destination_card_points_dist.html %}

**_radius_** is the minimum number of edges needed to connect the most central node (city) to all others.

```python
nx.radius(G)
```

```console
5
```

**_diameter_** is the minimum number of edges that will connect the two nodes that are far apart.


```python
nx.diameter(G)
```

```console
9
```

**_eccentricity_** is the maximum distance from a given node to all other nodes. Lower value of eccentricity means that the node is relatively closer to the center of network while the higher value of eccentricity
means that the node is relatively far from the center of the network.

```python
# ecc is the dictionary of nodes and their respective eccentricities.
ecc = nx.eccentricity(G)
```

All cities with maximum and minimum eccentricities are listed below:

<div style="float:left;width:100%;">
<div style="float:left;width:40%;margin:20px;">
<p>Cities with maximum eccentricities</p>
<table border="1" style="width:100%;">
  <thead>
    <tr style="text-align: right;">
      <th>city</th>
      <th>eccentricity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lisboa</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Cadiz</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Edinburgh</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Erzurum</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Sochi</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Rostov</td>
      <td>9</td>
    </tr>
    <tr>
      <td>Moskva</td>
      <td>9</td>
    </tr>
  </tbody>
</table>
</div>
<div style="float:left;width:40%;margin:20px;">
<p>Cities with minimum eccentricities</p>
<table border="1" style="width:100%;">
  <thead>
    <tr style="text-align: right;">
      <th>city</th>
      <th>eccentricity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Berlin</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Venezia</td>
      <td>5</td>
    </tr>
    <tr>
      <td>Munchen</td>
      <td>5</td>
    </tr>
  </tbody>
</table>
</div>
</div>

<br/>

**_center_** of the network is the set of nodes whose eccentricity equals the radius of the network. There are 3 cities (listed below) at the center
of the network. From all of these cities it is relatively easy to reach any part of the network.

```python
nx.center(G)
```

```console
['Berlin', 'Venezia', 'Munchen']
```

Its a good strategy to start your game by claiming routes around these cities at the center as its relatively easy to reach whatever direction you wish to continue as the game unfolds.


**_periphery_** of the network is the set of nodes whose eccentricity equals the diameter of the network. There are 7 cities (listed below) at
the periphery of the network. From each of these cities, it is relatively difficult to reach to the further part of the network.

```python
nx.periphery(G)
```

```console
['Lisboa', 'Cadiz', 'Edinburgh', 'Erzurum', 'Sochi', 'Rostov', 'Moskva']
```

It is a good strategy to choose destination cards with any of these cities at the periphery. Having one or more of these in
your control increases your chances of building the longest route. Your best bet would be to have two such cities but at the
opposite ends of the network. Listed below are all those routes from periphery cities with length equal to diameter. Considering these in your plan would
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


### Importance of some cities

Importance of cities can be measured with variety of centrality measures, clustering coefficient, connectivity and efficiency.

**_Degree centrality_** for a node is the fraction of nodes connected to it. **_Betweenness centrality_** of a node is the sum of the fraction of all-pairs shortest paths that pass through it.
**_Closeness centrality_** of a node is the reciprocal of the sum of the shortest path distances from the current node to all other nodes.

```python
dc = nx.degree_centrality(G)
cc = nx.closeness_centrality(G, distance='weight')
bc = nx.betweenness_centrality(G, weight='weight')
```

**_Clustering coefficient_** of a node is the ratio of number of connections in the neighborhood of a node and the number of connections if the neighborhood was fully connected.
This ratio tells how well connected the neighborhood of the node is. If the neighborhood is fully connected, the clustering coefficient is 1 and a value close to 0 means that there are hardly any connections in the neighborhood.

```python
ccoef = nx.clustering(G)
```
**_connectivity_** of a node is the minimum number of nodes required to be removed to block out all the paths to the subject node. The higher value is better.

Listed below is the table with all cities and their various importance measures. In the table below, `dc, bc, cc` are degree centrality, betweenness centrality and closeness centrality respectively. You may use sort option in each column
to see the top-10 or bottom-10 by selected feature. 

<div style="float:left;" class="col-md-12">
   <p>All Cities (Nodes) - Degree, Centrality Measures and Clustering</p>
   <table id="citiesTable" class="display col-md-12">
     <thead>
       <tr style="text-align: right;">
         <th class="col-md-2">city</th>
         <th class="col-md-2">degree</th>
         <th class="col-md-2">dc</th>
         <th class="col-md-2">bc</th>
         <th class="col-md-2">cc</th>
         <th class="col-md-2">clustering_coefficient</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td>Paris</td>
         <td>7</td>
         <td>0.152174</td>
         <td>0.137203</td>
         <td>0.100656</td>
         <td>0.285714</td>
       </tr>
       <tr>
         <td>Kyiv</td>
         <td>6</td>
         <td>0.130435</td>
         <td>0.127660</td>
         <td>0.093496</td>
         <td>0.200000</td>
       </tr>
       <tr>
         <td>Frankfurt</td>
         <td>6</td>
         <td>0.130435</td>
         <td>0.206094</td>
         <td>0.113022</td>
         <td>0.266667</td>
       </tr>
       <tr>
         <td>Pamplona</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.060386</td>
         <td>0.081129</td>
         <td>0.400000</td>
       </tr>
       <tr>
         <td>Marseille</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.118542</td>
         <td>0.097665</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Sevastopol</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.055753</td>
         <td>0.078498</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Constantinople</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.073816</td>
         <td>0.087287</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Bucuresti</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.154723</td>
         <td>0.101545</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Wilno</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.073269</td>
         <td>0.091089</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Warszawa</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.134599</td>
         <td>0.101099</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Budapest</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.176931</td>
         <td>0.117048</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Berlin</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.156821</td>
         <td>0.111922</td>
         <td>0.300000</td>
       </tr>
       <tr>
         <td>Wien</td>
         <td>5</td>
         <td>0.108696</td>
         <td>0.185461</td>
         <td>0.120104</td>
         <td>0.200000</td>
       </tr>
       <tr>
         <td>Madrid</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.085024</td>
         <td>0.069277</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Dieppe</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.047893</td>
         <td>0.093117</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Bruxelles</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.024771</td>
         <td>0.100218</td>
         <td>0.500000</td>
       </tr>
       <tr>
         <td>Amsterdam</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.060789</td>
         <td>0.099138</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Smyrna</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.041932</td>
         <td>0.082585</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Petrograd</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.010628</td>
         <td>0.070552</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Athina</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.057874</td>
         <td>0.089669</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Sofia</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.046377</td>
         <td>0.098081</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Essen</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.089372</td>
         <td>0.106977</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Zagrab</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.118201</td>
         <td>0.116751</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Sarajevo</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.057488</td>
         <td>0.103139</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Roma</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.101932</td>
         <td>0.101996</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Venezia</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.175206</td>
         <td>0.115869</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Munchen</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.162112</td>
         <td>0.117347</td>
         <td>0.166667</td>
       </tr>
       <tr>
         <td>Zurich</td>
         <td>4</td>
         <td>0.086957</td>
         <td>0.154051</td>
         <td>0.109524</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Barcelona</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.074879</td>
         <td>0.077052</td>
         <td>0.666667</td>
       </tr>
       <tr>
         <td>Brest</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.000000</td>
         <td>0.080844</td>
         <td>0.666667</td>
       </tr>
       <tr>
         <td>London</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.043478</td>
         <td>0.087121</td>
         <td>0.000000</td>
       </tr>
       <tr>
         <td>Erzurum</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.003382</td>
         <td>0.066570</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Angora</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.025121</td>
         <td>0.077181</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Sochi</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.024334</td>
         <td>0.071875</td>
         <td>0.666667</td>
       </tr>
       <tr>
         <td>Rostov</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.026248</td>
         <td>0.068047</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Kharkov</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.042958</td>
         <td>0.073482</td>
         <td>0.000000</td>
       </tr>
       <tr>
         <td>Moskva</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.014171</td>
         <td>0.070444</td>
         <td>0.000000</td>
       </tr>
       <tr>
         <td>Smolensk</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.034300</td>
         <td>0.077572</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Riga</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.007246</td>
         <td>0.078767</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Palermo</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.000000</td>
         <td>0.080420</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Danzig</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.033333</td>
         <td>0.090909</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Brindisi</td>
         <td>3</td>
         <td>0.065217</td>
         <td>0.056425</td>
         <td>0.093117</td>
         <td>0.333333</td>
       </tr>
       <tr>
         <td>Lisboa</td>
         <td>2</td>
         <td>0.043478</td>
         <td>0.000000</td>
         <td>0.057862</td>
         <td>1.000000</td>
       </tr>
       <tr>
         <td>Cadiz</td>
         <td>2</td>
         <td>0.043478</td>
         <td>0.000000</td>
         <td>0.057862</td>
         <td>1.000000</td>
       </tr>
       <tr>
         <td>Stockholm</td>
         <td>2</td>
         <td>0.043478</td>
         <td>0.001932</td>
         <td>0.070552</td>
         <td>0.000000</td>
       </tr>
       <tr>
         <td>Kobenhavn</td>
         <td>2</td>
         <td>0.043478</td>
         <td>0.033816</td>
         <td>0.083333</td>
         <td>0.000000</td>
       </tr>
       <tr>
         <td>Edinburgh</td>
         <td>1</td>
         <td>0.021739</td>
         <td>0.000000</td>
         <td>0.064972</td>
         <td>0.000000</td>
       </tr>
     </tbody>
   </table>
</div>

Few observations we can draw from the above table are as below:

From the table below, it can be observed that if you remove `Marsielle` there a `-10.35%` change in average connectivity around the network. So, if you want to
play a blocking game, you might want to own `Marsielle` and that would freak every one out a little bit.

Listed below are top-10 and bottom-10 cities by clustering coefficients. So, what these numbers mean to you? If the city you are interested
in has a lower value, it indicates that the neighborhood is not very well connected and there is a chance for you being blocked out if someone else
claims those route segments. So for cities like that you need to rush building route around them. Whereas the higher value means that the city has a very well
connected neighborhood and there are relatively less chances that you being blocked out. So, here you need not rush as much. Of course you want to
keep an eye on these route segments no matter what.





Apart from centrality measures and clustering, we can measure each city's importance by certain attacking strategies.
Importance of anything is better known only when its gone. So, we can iteratively remove one city at a time from the network and measure the
change in certain properties such as connectivity, efficiency etc. Removing a city in this context means that your opponents have claimed all routes
around that city and you are blocked out with respect to that city.

Listed below is the percent changes experienced in average shortest path cost which in our case means the average number of locomotives used to build a route.
Its interesting to know that removing `Essen` might cost you more as there is a `+8.24%` change in average cost to build a route. So, you might better
want to watch out routes around `Essen.` Also, its interesting that all the network pretty much stays connected when you remove any city except for
`London` and `Madrid`. When you remove `London`, `Edinburgh` becomes unreachable and when you remove `Madrid`, both `Lisboa` and `Cadiz` becomes
unreachable from else where. So, if you are interested in either of these cities, you better watch out `London` or `Madrid.`


Since clustering coefficient indicates the strongly connected neighborhood, the higher value of it is preferred. So, you might watch to watch out cities the absense of which causes big drop
of this factor. Also, the higher value of efficiency is desirable, so you dont want to compromise on the cities the removal of
which causes a big drop in efficiency.

### Importance of some edge segments

In the context of the game, its relatively hard that anyone gets blocked out for a city but its fairly easy to get blocked out on a route segment hence
knowing the importance of certain edge segments is more useful in this game. The importance of each route segment can be gauged by edge betweenness centrality,
and change in factors such as average connectivity, average clustering coefficient, efficiency.

From the table below, it can be observed that `Budapest-Wien, Zagrab-Vienna, Wien-Munchen` have the high betweenness centrality. So, certainly there is
a big competition for these segments.

From the tables below we can access each segments importance by the amount of impact they create when they were removed.

### Route Profitability Analysis

Listed below are all destination card routes with their shortest path characteristics sorted by the descending order of total points that you can achieve.
It can be observed that all long routes (card points >=20) fetch you around 50-54 final points if you get to do the shortest paths. You still will be left out with nearly half of
your locomotives besides doing shortest path in one of these routes because it costs you only around 20-21 locomotives at the max.

Also its interesting to know that the route `Edinburgh-Athina (21)` may seem more attractive over `Lisboa-Danzig (20)` because of the extra card point but
the shortest path of `Lisboa-Danzig` will fetch you `50` points where as `Edinburgh-Athina` fetches you only `48` points. This is in fact more evident in
the `sp_profitability` ratio which essentially explains how profitable is that route. It is simply the ratio of total final points and the cost for it which is the
number of locomotives you used to build that route. Also from the table, its evident that the most profitable shortest path route is `Palermo-Constantinople` which
would cost you only `8` locomotives for a return of `25` points. That would be a good short route card to grab besides one long route.

Another interesting factor to look at is the `edge_connectivity` listed in the table below. It indicates the minimum number of edges to remove for blocking out all
paths between a given source and destination nodes. The higher it is the better. It can be observed from detail below that `Berlin-Bucuresti` is by far
the most resilient route because it takes `5` edges for anyone to block you out. In the longer routes, `Edinburgh-Athina, Kobenhavn-Erzurum, Cadiz-Stockholm` are more
vulnerable for blockage because fo their lower edge connectivity values. So, you got to play with more caution if you were to do any of these routes.

<div style="float:left;" class="col-md-12">
    <p>All Destination Card Routes with shortest paths</p>
    <table id="table2" class="display col-md-12">
        <thead>
        <tr style="text-align: right;">
            <th>source</th>
            <th>destination</th>
            <th>card_points</th>
            <th>sp_length</th>
            <th>sp_cost</th>
            <th>sp_total_points</th>
            <th>sp_total_route</th>
            <th>sp_profitability</th>
            <th>edge_connectivity</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Palermo</td>
            <td>Moskva</td>
            <td>20</td>
            <td>7</td>
            <td>20</td>
            <td>54</td>
            <td>Palermo-Smyrna-Constantinople-Bucuresti-Kyiv-Smolensk-Moskva</td>
            <td>2.70</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Kobenhavn</td>
            <td>Erzurum</td>
            <td>21</td>
            <td>8</td>
            <td>21</td>
            <td>53</td>
            <td>Kobenhavn-Essen-Berlin-Wien-Budapest-Bucuresti-Sevastopol-Erzurum</td>
            <td>2.52</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Cadiz</td>
            <td>Stockholm</td>
            <td>21</td>
            <td>8</td>
            <td>21</td>
            <td>50</td>
            <td>Cadiz-Madrid-Pamplona-Paris-Frankfurt-Essen-Kobenhavn-Stockholm</td>
            <td>2.38</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Brest</td>
            <td>Petrograd</td>
            <td>20</td>
            <td>7</td>
            <td>20</td>
            <td>50</td>
            <td>Brest-Paris-Frankfurt-Berlin-Warszawa-Wilno-Petrograd</td>
            <td>2.50</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Lisboa</td>
            <td>Danzig</td>
            <td>20</td>
            <td>7</td>
            <td>20</td>
            <td>50</td>
            <td>Lisboa-Madrid-Pamplona-Paris-Frankfurt-Berlin-Danzig</td>
            <td>2.50</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Edinburgh</td>
            <td>Athina</td>
            <td>21</td>
            <td>9</td>
            <td>20</td>
            <td>48</td>
            <td>Edinburgh-London-Dieppe-Paris-Zurich-Venezia-Roma-Brindisi-Athina</td>
            <td>2.40</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Frankfurt</td>
            <td>Smolensk</td>
            <td>13</td>
            <td>5</td>
            <td>13</td>
            <td>32</td>
            <td>Frankfurt-Berlin-Warszawa-Wilno-Smolensk</td>
            <td>2.46</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Amsterdam</td>
            <td>Wilno</td>
            <td>12</td>
            <td>5</td>
            <td>12</td>
            <td>29</td>
            <td>Amsterdam-Frankfurt-Berlin-Warszawa-Wilno</td>
            <td>2.42</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Berlin</td>
            <td>Moskva</td>
            <td>12</td>
            <td>5</td>
            <td>12</td>
            <td>29</td>
            <td>Berlin-Warszawa-Wilno-Smolensk-Moskva</td>
            <td>2.42</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Essen</td>
            <td>Kyiv</td>
            <td>10</td>
            <td>4</td>
            <td>10</td>
            <td>26</td>
            <td>Essen-Berlin-Warszawa-Kyiv</td>
            <td>2.60</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Riga</td>
            <td>Bucuresti</td>
            <td>10</td>
            <td>4</td>
            <td>10</td>
            <td>26</td>
            <td>Riga-Wilno-Kyiv-Bucuresti</td>
            <td>2.60</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Athina</td>
            <td>Wilno</td>
            <td>11</td>
            <td>5</td>
            <td>11</td>
            <td>26</td>
            <td>Athina-Sofia-Bucuresti-Kyiv-Wilno</td>
            <td>2.36</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Stockholm</td>
            <td>Wien</td>
            <td>11</td>
            <td>5</td>
            <td>11</td>
            <td>25</td>
            <td>Stockholm-Kobenhavn-Essen-Berlin-Wien</td>
            <td>2.27</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Palermo</td>
            <td>Constantinople</td>
            <td>8</td>
            <td>3</td>
            <td>8</td>
            <td>25</td>
            <td>Palermo-Smyrna-Constantinople</td>
            <td>3.12</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Venezia</td>
            <td>Constantinople</td>
            <td>10</td>
            <td>5</td>
            <td>10</td>
            <td>22</td>
            <td>Venezia-Zagrab-Sarajevo-Sofia-Constantinople</td>
            <td>2.20</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Angora</td>
            <td>Kharkov</td>
            <td>10</td>
            <td>5</td>
            <td>10</td>
            <td>22</td>
            <td>Angora-Erzurum-Sochi-Rostov-Kharkov</td>
            <td>2.20</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Bruxelles</td>
            <td>Danzig</td>
            <td>9</td>
            <td>4</td>
            <td>9</td>
            <td>22</td>
            <td>Bruxelles-Frankfurt-Berlin-Danzig</td>
            <td>2.44</td>
            <td>3</td>
        </tr>
        <tr>
            <td>London</td>
            <td>Wien</td>
            <td>10</td>
            <td>5</td>
            <td>9</td>
            <td>20</td>
            <td>London-Amsterdam-Frankfurt-Munchen-Wien</td>
            <td>2.22</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Madrid</td>
            <td>Dieppe</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>20</td>
            <td>Madrid-Pamplona-Paris-Dieppe</td>
            <td>2.50</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Berlin</td>
            <td>Bucuresti</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>20</td>
            <td>Berlin-Wien-Budapest-Bucuresti</td>
            <td>2.50</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Kyiv</td>
            <td>Sochi</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Kyiv-Kharkov-Rostov-Sochi</td>
            <td>2.38</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Berlin</td>
            <td>Roma</td>
            <td>9</td>
            <td>5</td>
            <td>9</td>
            <td>19</td>
            <td>Berlin-Frankfurt-Munchen-Venezia-Roma</td>
            <td>2.11</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Madrid</td>
            <td>Zurich</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Madrid-Barcelona-Marseille-Zurich</td>
            <td>2.38</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Smolensk</td>
            <td>Rostov</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Smolensk-Moskva-Kharkov-Rostov</td>
            <td>2.38</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Barcelona</td>
            <td>Munchen</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Barcelona-Marseille-Zurich-Munchen</td>
            <td>2.38</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Barcelona</td>
            <td>Bruxelles</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Barcelona-Pamplona-Paris-Bruxelles</td>
            <td>2.38</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Sarajevo</td>
            <td>Sevastopol</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Sarajevo-Sofia-Bucuresti-Sevastopol</td>
            <td>2.38</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Roma</td>
            <td>Smyrna</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>19</td>
            <td>Roma-Brindisi-Athina-Smyrna</td>
            <td>2.38</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Brest</td>
            <td>Marseille</td>
            <td>7</td>
            <td>3</td>
            <td>7</td>
            <td>18</td>
            <td>Brest-Paris-Marseille</td>
            <td>2.57</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Brest</td>
            <td>Venezia</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>18</td>
            <td>Brest-Paris-Zurich-Venezia</td>
            <td>2.25</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Paris</td>
            <td>Wien</td>
            <td>8</td>
            <td>4</td>
            <td>8</td>
            <td>18</td>
            <td>Paris-Frankfurt-Munchen-Wien</td>
            <td>2.25</td>
            <td>5</td>
        </tr>
        <tr>
            <td>Edinburgh</td>
            <td>Paris</td>
            <td>7</td>
            <td>4</td>
            <td>7</td>
            <td>17</td>
            <td>Edinburgh-London-Dieppe-Paris</td>
            <td>2.43</td>
            <td>1</td>
        </tr>
        <tr>
            <td>Amsterdam</td>
            <td>Pamplona</td>
            <td>7</td>
            <td>4</td>
            <td>7</td>
            <td>17</td>
            <td>Amsterdam-Bruxelles-Paris-Pamplona</td>
            <td>2.43</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Marseille</td>
            <td>Essen</td>
            <td>8</td>
            <td>5</td>
            <td>8</td>
            <td>16</td>
            <td>Marseille-Zurich-Munchen-Frankfurt-Essen</td>
            <td>2.00</td>
            <td>4</td>
        </tr>
        <tr>
            <td>London</td>
            <td>Berlin</td>
            <td>7</td>
            <td>4</td>
            <td>7</td>
            <td>15</td>
            <td>London-Amsterdam-Frankfurt-Berlin</td>
            <td>2.14</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Paris</td>
            <td>Zagrab</td>
            <td>7</td>
            <td>4</td>
            <td>7</td>
            <td>15</td>
            <td>Paris-Zurich-Venezia-Zagrab</td>
            <td>2.14</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Kyiv</td>
            <td>Petrograd</td>
            <td>6</td>
            <td>3</td>
            <td>6</td>
            <td>15</td>
            <td>Kyiv-Wilno-Petrograd</td>
            <td>2.50</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Warszawa</td>
            <td>Smolensk</td>
            <td>6</td>
            <td>3</td>
            <td>6</td>
            <td>14</td>
            <td>Warszawa-Wilno-Smolensk</td>
            <td>2.33</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Zurich</td>
            <td>Budapest</td>
            <td>6</td>
            <td>4</td>
            <td>6</td>
            <td>13</td>
            <td>Zurich-Munchen-Wien-Budapest</td>
            <td>2.17</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Zagrab</td>
            <td>Brindisi</td>
            <td>6</td>
            <td>4</td>
            <td>6</td>
            <td>12</td>
            <td>Zagrab-Venezia-Roma-Brindisi</td>
            <td>2.00</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Zurich</td>
            <td>Brindisi</td>
            <td>6</td>
            <td>4</td>
            <td>6</td>
            <td>12</td>
            <td>Zurich-Venezia-Roma-Brindisi</td>
            <td>2.00</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Budapest</td>
            <td>Sofia</td>
            <td>5</td>
            <td>3</td>
            <td>5</td>
            <td>11</td>
            <td>Budapest-Sarajevo-Sofia</td>
            <td>2.20</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Sofia</td>
            <td>Smyrna</td>
            <td>5</td>
            <td>3</td>
            <td>5</td>
            <td>11</td>
            <td>Sofia-Constantinople-Smyrna</td>
            <td>2.20</td>
            <td>4</td>
        </tr>
        <tr>
            <td>Rostov</td>
            <td>Erzurum</td>
            <td>5</td>
            <td>3</td>
            <td>5</td>
            <td>11</td>
            <td>Rostov-Sochi-Erzurum</td>
            <td>2.20</td>
            <td>3</td>
        </tr>
        <tr>
            <td>Frankfurt</td>
            <td>Kobenhavn</td>
            <td>5</td>
            <td>3</td>
            <td>5</td>
            <td>11</td>
            <td>Frankfurt-Essen-Kobenhavn</td>
            <td>2.20</td>
            <td>2</td>
        </tr>
        <tr>
            <td>Athina</td>
            <td>Angora</td>
            <td>5</td>
            <td>3</td>
            <td>5</td>
            <td>11</td>
            <td>Athina-Smyrna-Angora</td>
            <td>2.20</td>
            <td>3</td>
        </tr>
        </tbody>
    </table>
</div>

<br/><br/>

### Blocking Strategies

### Code 

All the code used in this analysis can be downloaded from this [github repository](https://github.com/genielab/network_analysis_ticket_to_ride)

<br/>