---
date: 2019-04-04
title: "The story of H-1B using data (Part-2): Cost of Living, Inflation and House Affordability Analysis"
excerpt: "In the Part-2 of this series, we do advanced analysis with focus on cost of living and housing affordability comparision for selected groups and also observe how inflation is affecting the real income."
comments: true
header:
  overlay_image: https://www.immi-usa.com/wp-content/uploads/2016/01/h1b-visa-2016.jpg
  show_overlay_excerpt: false
  overlay_filter: 0.5
  caption: ""
image_path: https://www.immi-usa.com/wp-content/uploads/2016/01/h1b-visa-2016.jpg
resources_dir: post_resources/h1b_data_analysis/
toc: true
toc_sticky: true
categories:
  - Data Stories
tags:
  - Exploratory Data Analysis (EDA)
  - Immigration
  - H1B Visa
permalink: /data-stories/:title/
---

<i>This blog is part-2 of a 2-part series of blogs on data analysis and exploration on H-1B visa public dataset.</i>
* [Part-1: Exploratory Data Analysis]({% post_url 2019-04-04-h1b_data_analysis_part1 %})
* [Part-2: Cost of Living, Inflation and House Affordability Analysis (current post)]({% post_url 2019-04-04-h1b_data_analysis_part2 %}) 
<br/>

<div class="alert alert-info">
  <strong>NOTE:</strong> Please note that this blog post has lot of interactive data visualization content and these will be better rendered when 
  viewed in a laptop or desktop. Also in some of these interactive visualizations, hover upon data points where ever possible so as to see more detailed information.
  Sometimes there are sliders, use them to navigate between different time periods. 
</div>

## Introduction

In the Part-2 of this series, we do advanced analysis with focus on cost of living and housing affordability comparision
for selected groups and also observe how inflation is affecting the real income.

## Data

We will continue using the same data [OFLC H1B Dataset 2011-2018 on Kaggle](https://www.kaggle.com/rakeshchintha/oflc-h1b-data){:target="_blank"} which we used in Part-1 of this series.

Additionally we will use the following data:
* [Numbeo.com Cost of Living data](https://www.numbeo.com/cost-of-living/){:target="_blank"} 
* [Zillow Market Research Data](https://www.zillow.com/research/data/){:target="_blank"}

These supplementary data sets are also provided in the [github repository](https://github.com/genielab/h1b_data_analysis){:target="_blank"} 

## Cost of Living Analysis

Cost of Living Index (COLI) is a measure used to compare how expensive to live in a city versus others. 
[Numbeo.com](https://www.numbeo.com/cost-of-living/){:target="_blank"} generates a wide range of indices on yearly basis for cost of living, 
prices of groceries and other goods and services, property prices, health care, traffic and quality of life. 
These indices help us compare cities more effectively. For the purpose of this analysis, we collect these indices for the year 2018.
Also note that Numbeo based their indices with New York as a reference point which has a value of 100 always
For example, Rent Index of San Francisco,CA is 106 which means that renting is 6% more expensive than that of NY.

We combine Numbeo's 2018 indices with H1B dataset (2018 certified only) and plot the chart to analyze the relationship between these indices and median wages,
<style>
.responsive-wrap iframe{ max-width: 100%;}
</style>

<div id="chart1"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/coli_2018.html" frameborder="0" width="3000" height="800" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* For Cost of Living Index (COLI), a general rise of median wages is observed as COLI rises but there are lot of dips and exceptions.
* New York (COLI=100) has median wage of roughly $100K which is not higher than other major spikes which roughly occurred around
COLI=96.88 (San Francisco), COLI=85.51 (Seattle), COLI=81.18 (San Jose) and COLI=76.28 (Oakland).
* For Rent Index (RI) again there is a general increase in median wage with rise in index value but there are again few dips and spikes such as
RI=106.49 (San Francisco),  RI=64.7 (Bellevue) ,  RI=76.61 (Seattle),  RI=61.2 (Oakland) ,  RI=77.14 (San Jose).
* It can be observed that renting in SF is 6% more expensive than that of NY though COLI for SF is lower than that of NY.
* For Local Purchasing Power Index (LPPI), major spikes occurred roughly around values such as LPPI=125.95 (San Francisco), 
LPPI=140 (Bellevue), LPPI=170.91 (Seattle), LPPI=186 (Oakland), LPPI=137.74 (San Jose). All these cities enjoy considerably higher median wages
and also more purchasing power when compared to NY.

## Housing Affordability Analysis

For our analysis here, we will leverage some 
market research data published by [Zillow](https://www.zillow.com/research/data/){:target="_blank"}. Specifically we will use two values from 
the dataset such as [Zillow Home Value Index (ZHVI)](https://www.zillow.com/research/zhvi-methodology-6032/){:target="_blank"} 
and [Zillow Rent Index (ZRI)](https://www.zillow.com/research/zillow-rent-index-methodology-2393/){:target="_blank"}. 

Below are descriptions from Zillow website:
> Zillow Home Value Index (ZHVI): A smoothed, seasonally adjusted measure of the median estimated home value across a given region and housing type. It is a dollar-denominated alternative to repeat-sales indices.
<br/><br/>
> Zillow Rent Index (ZRI): A smoothed measure of the median estimated market rate rent across a given region and housing type. ZRI is a dollar-denominated alternative to repeat-rent indices. 

We combine both ZHVI and ZRI for each city with H1B visa petitions (2018 certified only) and then calculate few metrics such 
as median house mortgage payment for median house in respective cities. 
We then express it as percentage of monthly income, and also express median rent as percentage of monthly income. 
From these two ratios, we derive both house affordability and rent affordability for all data points. 
The higher the values of these indices are, the higher is the affordability level. Sample code excerpt is listed below:

```python
data_zhvi_allhomes = '/Users/genie/data/zillow/City_Zhvi_AllHomes.csv'
data_1bd_rent = '/Users/genie/data/zillow/City_MedianRentalPrice_1Bedroom.csv'

df_zhvi_allhomes = pd.read_csv(data_zhvi_allhomes,na_values='',encoding = "ISO-8859-1")
df_zhvi_allhomes['city_state'] = df_zhvi_allhomes.apply(lambda x: x['RegionName'].strip() + ',' + x['State'].strip(), axis=1)
df_zhvi_allhomes = df_zhvi_allhomes[['city_state','2018-12']]
df_zhvi_allhomes.rename(columns={'2018-12':'zhvi_allhomes_2018'}, inplace=True)
df_1bd_rent = pd.read_csv(data_1bd_rent,na_values='',encoding = "ISO-8859-1")
df_1bd_rent['city_state'] = df_1bd_rent.apply(lambda x: x['RegionName'].strip() + ',' + x['State'].strip(), axis=1)
df_1bd_rent = df_1bd_rent[['city_state','2018-12']]
df_1bd_rent.rename(columns={'2018-12':'rent_1bd_2018'}, inplace=True)
df_zillow = pd.merge(df_zhvi_allhomes, df_1bd_rent, how='left', on=['city_state'])

df_certified_2018 = df[(df.fiscal_year==2018) & (df.case_status=="C") & (pd.notnull(df.metro)) & (df.metro.isin(selected_metros))]
df_certified_2018['avg_annual_wage'] = df_certified_2018.apply(calc_emp_avg_annual_wage, axis=1)
df_certified_2018 = pd.merge(df_certified_2018,df_zillow,how='left',on=['city_state'])
df_certified_2018['monthly_mortgage_payment'] = df_certified_2018.apply(calc_monthly_mortgage_payment_for_30yrfixed, axis=1)
df_certified_2018['mortgage_as_percent_of_income'] = df_certified_2018.apply(lambda x: round(((x['monthly_mortgage_payment'])/(x['avg_annual_wage']/12))*100,2),axis=1)
df_certified_2018['rent_as_percent_of_income'] = df_certified_2018.apply(lambda x: round(((x['rent_1bd_2018'])/(x['avg_annual_wage']/12))*100,2),axis=1)
df_certified_2018['house_affordability_index'] = df_certified_2018.apply(lambda x: round(100/x['mortgage_as_percent_of_income'],2), axis=1)
df_certified_2018['rent_affordability_index'] = df_certified_2018.apply(lambda x: round(100/x['rent_as_percent_of_income'],2), axis=1)
``` 

### Housing Affordability in Selected Cities
In <a href="#chart2">Chart-2</a> we plot the house affordability in selected cities. We also plot <a href="#chart3">Chart-3</a> to compare house vs rent affordability in the selected cities.

<div id="chart2"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/house_affordability_in_selected_cities_2018.html" frameborder="0" width="3000" height="800" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Tulsa has the median affordability of 11.37 which is way higher than medians in other cities. It's P25=9.72 itself is higher than median
affordability in most cities. In other words, the real estate is relatively less expensive and is within the affordability radar for the income earned.
* The other cities such as St.Louis, Pittsburgh, Philadelphia and Milwaukee also have considerable population with higher affordability ranges.
* You will also notice that affordability ranges for majority of population are relatively lower in cities such as New York, Los Angeles, SF Bay Area,
San Diego, Seattle, Washington DC and Honolulu especially because of the high real estate cost.
* In other cities such as Chicago, Houston, Dallas, Charlotte, Raleigh etc, the affordability range is better but not great. 

In the previous chart, we have seen affordability ranges for all percentiles, but in below chart we will consider only P50 affordability 
for house and rent in each city.

<div id="chart3"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/P50_house_affordability_in_selected_cities_2018.html" frameborder="0" width="3000" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Tulsa has higher median (P50) affordability both for owning a house or renting.
* In certain cities such as Detroit, Minneapolis, Orlando, Phoenix, Raleigh and St.Louis, both owning or renting is pretty much 
around the same range.
* In certain cities such as Anchorage, Honolulu, New York, Los Angeles, SF Bay Area, Seattle, renting is affordable option over owning.
* In certain cities such as Pittsburgh, Dallas, Houston, Milwaukee, Philadelphia etc, owning makes more sense than renting.

### Housing Affordability in Selected Employers
We conduct a similar analysis again but this time for selected employers and then plot the below charts <a href="#chart4">Chart-4</a>
and <a href="#chart5">Chart-5</a>

<div id="chart4"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/house_affordability_in_selected_companies_2018.html" frameborder="0" width="3000" height="800" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

<div id="chart5"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/P50_house_affordability_in_selected_companies_2018.html" frameborder="0" width="3000" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above charts <a href="#chart4">Chart-4</a> and <a href="#chart5">Chart-5</a>:
* One interesting observation from <a href="#chart4">Chart-4</a> that you can make is that all the oil sector companies have a distinctively
high house affordability ranges. This is in fact evident in <a href="#chart5">Chart-5</a> as well. The primary reason behind is that the work sites of these companies are located in relatively
less expensive areas. 
* From <a href="#chart4">Chart-4</a> and <a href="#chart5">Chart-5</a> you will also observe that all the tech companies such as Google, Facebook, Uber, Amazon, Airbnb etc have lower affordability ranges because most of these companies 
have their work sites in metropolitan areas. 

## Inflation Analysis

### Background
For example if you earn $75K in 2011 and last year in 2018 you earned $80K, would you tell that your income had rise? Certainly not!
You cannot directly compare incomes from two different time periods because the purchasing power of a dollar is not same in the past as it is today. 
You have to take into account the inflation effect and then express both incomes into the same time period either in 2011 dollars or in 2018 dollars and then compare the real incomes. 

The U.S. Bureau of Labor Statistics (BLS) has defined a statistical measure called Consumer Price Index (CPI) which
is a weighted average of prices of "basket of goods," which is a collection of many goods and services that are commonly used by consumers. 
Every month, the prices of these goods are measured and compared to previous prices.

Below is an excerpt from [BLS website](https://www.bls.gov/cpi/questions-and-answers.html){:target="_blank"}:
> The Consumer Price Index (CPI) is a measure of the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services.
> The CPI represents all goods and services purchased for consumption by the reference population (U or W). BLS has classified all expenditure items into more than 200 categories, arranged into eight major groups (food and beverages, housing, apparel, transportation, medical care, recreation, education and communication, and other goods and services). Included within these major groups are various government-charged user fees, such as water and sewerage charges, auto registration fees, and vehicle tolls.

CPI can be calculated as a national average or specifically by city or a specific goods or products. 

### Did the real incomes rise ?
We collect CPI prices for few cities from 2011 and 2018 and then compare median real incomes in these cities for the periods of 2011 and 2018. First we convert 2011 median incomes 
grouped by city into 2018 dollars by using CPI's of both time periods. For more information on how to perform this conversion, 
please [refer this website](http://www.in2013dollars.com/). Below are the results.

<div id="chart6"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/inflation_selected_cities_2018.html" frameborder="0" width="3000" height="600" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* In certain cities such as Atlanta, Houston, Minneapolis and Miami, real income rise is on par with the actual inflation.
* In certain cities such as Chicago, Dallas, New York, Philadelphia, St.Louis and Tampa real income is rising faster than the actual inflation.
* In certain cities such as SF Bay Area, Seattle, Denver, Phoenix and Boston, the real income rise is not keeping up with the inflation effect.
* San Diego has seen nearly 28% of inflation from 2011 to 2018. The face value of incomes may have increased but the real median income has been decreasing.

## Disclaimer & Code
Please note that the results published in this case study are solely based on my data analysis and the code I wrote. 
I would strongly recommend you to use this analysis for educational purposes only but do not use this to base any of your decisions or 
make any conclusions. Please validate from your sources when possible. If you find any error in the analysis, please feel free to bring it to my notice. Also, please feel free to express any concerns or 
send in any questions or comments. 

All the code used in this analysis can be downloaded from this [github repository](https://github.com/genielab/h1b_data_analysis){:target="_blank"}
<br/>
