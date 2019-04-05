---
date: 2019-04-04
title: "The story of H-1B using data (Part-1): Exploratory Data Analysis"
excerpt: "In the Part-1 of this series, we do a comprehensive data exploration and analysis on H1B visa dataset focusing primarily on demand and salary analysis."
comments: true
header:
  overlay_image: https://storage.googleapis.com/kaggle-datasets-images/893/1631/b233e76a75228c8362daf5ffd2ddd7d5/dataset-cover.jpg
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

<i>This blog is part-1 of a 2-part series of blogs on data analysis and exploration on H-1B visa public dataset.</i>
* [Part-1: Exploratory Data Analysis  (current post)]({% post_url 2019-04-04-h1b_data_analysis_part1 %})
* [Part-2: Cost of Living, Inflation and House Affordability Analysis]({% post_url 2019-04-04-h1b_data_analysis_part2 %}) 
<br/>

<div class="alert alert-info">
  <strong>NOTE:</strong> Please note that this blog post has lot of interactive data visualization content and these will be better rendered when 
  viewed in a laptop or desktop. Also in some of these interactive visualizations, hover upon data points where ever possible so as to see more detailed information.
  Sometimes there are sliders, use them to navigate between different time periods. 
</div>


## Introduction
In the Part-1 of this series, we do a comprehensive data exploration and analysis on H1B visa dataset focusing primarily on demand and salary analysis.

### Background
H-1B is a special occupation related non-immigrant visa granted for temporary workers. 
To obtain this visa employers must offer a job in the US and apply a petition to United States Citizenship and Immigration Services (USCIS) on behalf of non-immigrant employee. 
H-1B application process involves two steps. In the first step, applicant’s employer performs prevailing wage determination and files for LCA with DOL (Dept. of Labor). 
Upon DOL’s certification, employer further files the I-129 petition with US Citizenship & Immigration Services (USCIS). 
USCIS reviews the application and then finally approves or denies applicant’s H-1B.

## Data
The Office of Foreign Labor Certification (OFLC) generates [disclosure data](){:target="_blank"} on quarterly basis. 
This includes all Labor Certification Application (LCA) data for both cap-subject petitions such as new H1B and also cap-exempt petitions such as change of employer, amendment or a renewals.

For this analysis, all the raw data between dates 2011 to 2018 is downloaded from their website and then the following necessary transformations were applied:
* Some variable names and representations are not consistent across data files of all years, hence converted data files into into more consistent form 
regarding variable names, data types and formats.
* All the Personal Identifiable Information (PII) such as case number, attorney phone numbers, employer phone numbers etc.
* The variable values for **case_status** has been shortened to 'C','CW','W','D' which represent 'CERTIFIED','CERTIFIED-WITHDRAWN','WITHDRAWN','DENIED' respectively.
 
The transformed data is published on Kaggle platform [OFLC H1B Dataset 2011-2018 on Kaggle](https://www.kaggle.com/rakeshchintha/oflc-h1b-data){:target="_blank"} for public use.

 
## Geographic Analysis

### Which states generate more demand?
<a href="#chart1">Chart-1</a> shows the distribution of H-1B volume statewide. This is an interactive chart, use the year slider below the chart to 
reflect the state-wide data for the respective fiscal year.

<style>
.responsive-wrap iframe{ max-width: 100%;}
</style>

<div id="chart1"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_statewide_dist.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* As you slide through fiscal years you will find that the three states of California, Texas and New York have consistently been at the top regarding application volume from fiscal years 2011 to 2018
* In 2011, application volume in the states of California, New York and Texas are around 74K (~18%), 40K (~11%), 31K (~8%) respectively. Fast forward to 2018, California alone has around 124K which
accounted for nearly 19% of nationwide volume that year. Texas and New York have application volume of 63K (~10%) and 54K (~8%) respectively. Overall the three states have gradually increased their
volumes.
* Application volumes in other states such as Washington, Illinois, Florida, Georgia, Michigan, Pennsylvania, Ohio, North Carolina and South Carolina also considerably increased over these years.

### Which cities have more demand ?
Now lets see <a href="#chart2">Chart-2</a> which shows the nationwide distribution of H1B applications,
 
<div id="chart2"></div> 
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_city_dist.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Clearly, all the H-1B jobs are primarily concentrated around the metropolitan areas. 
In the East coast, the primary demand is around New York, Philadelphia and Boston while on the West coast is around San Francisco ~ Bay area, Seattle and Los Angeles. 
Also, there is considerable market in Houston, Austin, Dallas, Chicago, Phoenix, Atlanta.
* In the previous section we have seen California as a state stands out in application volume all years, however when we consider the 
city distributions, New York city stands out. In Big Apple alone, the volumes grew from 25K in 2011 to 36K in 2018 which is more demand than some states themselves.
* San Francisco Bay Area and Seattle also have grown to be major centers on par with New York.
* The application volume in Houston grew until 2015 but since then there has been a decline.

### Wage Analysis for Selected Cities

Let us look at the gross salary percentile <a href="#chart3">Chart-3</a> for few selected metropolitan areas for the fiscal year 2018. In this interactive chart, as you hover over bars they reveal more information. Also you may want to 
selectively enable or disable percentile segment items in the legend to understand in more detail one segment at a time.

<div id="chart3"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_cities_percentile_salary_2018.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* P25 Perspective: The bottom 25% in most of the cities is below ~$80K while only two metro areas stand out - SF Bay Area and Seattle whose bottom 25% people earn more than $90K. Even in high demand cities 
such as New York and Los Angeles, the bottom 25% is not earning on par.
* P50 Perspective: Again only two cities stand out - SF Bay Area and Seattle with P50 salary more than $100K.
* P75 perspective: The top 25% in SF Bay Area and Seattle are at $147K and $137K respectively. The top 25% in less expensive city such as Austin also making on par with their counterparts in both LA and NY.
* P90 Perspective: The top 10% in all the cities earn more than $100K. SF Bay Area and Seattle top it all again with top 10% in these cities earning more than $170K and $155K respectively. New York and Los Angeles both are at range 
$130K. Even relatively less expensive cities such as Austin and Houston are also over $130K which makes it evident that the top 10% in both NY and Los Angeles is not as rich as we think to be. 
* In all perspectives you will observe that in all cities where there is no state tax, Seattle tops it all while other no state tax cities such as Austin, Dallas, Houston etc are not on par. Also with relatively less expensive
places such as Austin is getting more charm when compared to big centers such as NY and LA which is more evident in P25 and P90 salaries in Austin.

While dealing with distribution of data points in statistical terms, we consider all the data points whose value is either greater than P75 + 1.5 * IQR
or lesser than P25 - 1.5 * IQR as outliers, where IQR is the Inter Quartile Range and is defined as P75-P25. Thus we plot another figure <a href="#chart4">Chart-4</a> to denote the
outlier employee proportions in select companies. You may selectively enable or disable to isolate categories by clicking on legend items. The y-axis 
represents percentage of H1B population in that year and as you hover over bars, they reveal the outlier wages in respective cities.

<div id="chart4"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_cities_outliers_2018.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Anchorage in Alaska has the highest proportion of outlier population with both segments combined accounting for nearly 10% of which majority belong to affluent segment whose wage in this city is more than $129K.
* Pittsburgh, Las Vegas and Honolulu also have affluent proportions of more than 6%.
* Overall, the low income segment accounts for less than 1% in all the cities.

Has the median salary in these cities increased over these years? In the below figure <a href="#chart5">Chart-5</a>, we plot how median salaries varied over years 2011 to 2018 in selected cities. You may want to enable or disable individual
cities for better visual rendering,

<div id="chart5"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_cities_median_salary.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* SF Bay Area and Seattle top it all consistently over these years. Only in the year 2012, Seattle applications had more median salary than that of SF Bay Area, but later SF secured its position.
* As you compare NY and LA alone, you will see that LA topped over years but post 2017, NY started rising past LA.
* The median salaries in Austin and Boston also steadily rising and much better than NY and LA.
* Philadelphia enjoyed a gradual rise over years with bigger rise in 2016 but post that it dropped. From 2016-2017, Philadelphia and Orlando are the only cities which 
experienced drop in median salaries while all other cities were rising.

### Degree of Income Inequality of Wages in Selected Cities
In statistics, Gini Index is used primarily in measuring how the income is distributed across the population. Gini value of 0 represents a
perfect ideal society where everyone is pretty much at the same income level. The higher value of gini indicates that there is higher degree of variation in salaries in the observed population. 
Please refer this wiki page [Gini coefficient](https://en.wikipedia.org/wiki/Gini_coefficient){:target="_blank"} for more information. In the below figure 
<a href="#chart6">Chart-6</a>, we calculate and plot how gini varied over years in selected cities

<div id="chart6"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_cities_gini.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Overall you will observe that there is a high degree of inequality in most cities prior to 2014. After that gini dropped in most cities which indicates that pay scales have become pretty much equivalent with not much variations.
* Chicago in 2014 had a very high degree of inequality with gini=0.95 and after that it rapidly dropped.
* Tulsa in 2011 had gini=0.95 with very high degree of inequality and the value dropped gradually over years with gini=0.22 in 2018.
* In 2018, only 5 cities have gini>0.2 and they are Anchorage, Dallas, Honolulu, Chicago and Tulsa while all other cities kept their gini at record low. 
  

## Employer Analysis

### Who hires a lot ?
In the below <a href="#chart7">Chart-7</a>, we plot some selected companies who top every fiscal year in terms of application demand. 
In this chart, each bubble represents a company and color represents their corresponding category from the legend items listed in the top right corner. 
Also size of each bubble represents the number of certified application cases that the company has for that fiscal year. 
The x-axis represents the approval rate of the company which is the percentage of applications actually certified in the total applications filed in the fiscal year. 
The y-axis represents the average median salary. 
So, each bubble is positioned appropriately based on their approval rate and median salary for that fiscal year.

<div id="chart7"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_popular_employers.html" frameborder="0" width="4000" height="900" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* You will notice that in the every passing fiscal year, consulting companies (blue colored) dominate 
the application space by the huge number of petitions that they file every fiscal year. Also based on how they are 
positioned in the chart, its evident that they dont pay quite well when compared to companies in other categories.
* Over these years, Tech companies have gradually picked up both in demand and in terms of median salary as well. From 2011 until 2017, you till notice that Netflix (small orange bubble at the top)
 stands out distinctively with very high median salary. In 2015, Netflix's median salary at $240K which is way higher than all companies in all categories, 
 however later it dropped gradually. Overall in 2018, Tech companies (all orange bubbles) all kind of converged together without any outliers.
* The demand generated by all financial companies (green bubbles) also gradually increased over years. The median salaries also improved. You will notice that
within financial sector, Wells Fargo has a better median salary when compared to other companies in the same category.
* In the oil sector, the demand is kept very low and salaries good enough. Not much demand has been generated over years.
* IBM's approval rate dropped gradually. Shell's approval rates also dropped quite a bit in previous years but it improved again.

### Who pays good ?
In the previous figure <a href="#chart7">Chart-7</a> we have seen briefly about how some popular companies median salaries varied over years. 
In the below figure <a href="#chart8">Chart-8</a> we plot a percentile salaries of all certified H1B applications in these select companies for the fiscal year 2018. Again, this is an interactive chart and as 
you hover upon bars, you will see more detailed information. Also please note that by clicking on the individual legend items, you can selectively enable or disable items in the legend so as to isolate a category and study 
in detail one category at a time.

<div id="chart8"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_companies_percentile_salary_2018.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* First and foremost, you will notice that most of the consulting companies which generate a lot of demand often end up paying much less than other companies.
* P25 Perspective: The bottom 25% population itself is making more than $120K in select few companies such as Airbnb, Apple, Chevron, Exxon, Facebook, Google, Microsoft, Netflix, 
Shell, Wells Fargo however in some consulting firms, this segment earns less than $80K.
* P50 Perspective: Only two companies Airbnb and Exxon have a median salary of over $160K in 2018. Facebook, Netflix and Wells Fargo have a median salary over $150K 
whereas a majority of companies are around $120K and all consulting firms have a P50 less than $85K.
* P90 Perspective: Its quite interesting to know that the top 10% employees in Airbnb and Exxon earn more than $200K. Majority of other companies have a P90 around $150K.
You will also notice that 90% of the employees in consulting firms such as Infosys, Wipro and TCS are earning less than $100K while in Infosys, Deloitte and Capgemini the situation for this segment 
is slightly better but not great though. 

While dealing with distribution of data points in statistical terms, we consider all the data points whose value is either greater than P75 + 1.5 * IQR
or lesser than P25 - 1.5 * IQR as outliers, where IQR is the Inter Quartile Range and is defined as P75-P25. Thus we plot another figure 
<a href="#chart9">Chart-9</a> to denote the outlier employee proportions in select companies. You may selectively enable or disable to isolate categories by 
clicking on legend items.

<div id="chart9"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_companies_outliers_2018.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* You will notice that only three companies Netflix, BP and Exxon have a bigger proportions of outliers with Netflix having around 20% of outliers which includes both affluent and low income segment as well.
* The affluent segments in both Netflix and Exxon Mobil are on top of the charts. In Netflix, affluent segment accounts for 7.7% roughly and they have a minimum salary of $188K where
as in Exxon Mobil, affluent segment accounts for nearly 12% within 2018 H1B certified cases and their salary is over $195K.
* In companies such as Walmart and Uber though affluent segments are in very small proportions on the other hand they are earning at least $230K.
* In companies such as TCS, $96K and above itself is considered affluent segment.
* Netflix and BP have higher proportions of low income segments. In Netflix anything below $135K is considered low income segment where as in BP, below $96K is considered a 
low income segment.

Has the median salary in these selected employers increased over these years? In the below figure <a href="#chart10">Chart-10</a>, we plot how median salaries varied over years 2011 to 2018 in selected employers. 
You may want to enable or disable individual employers for better visual rendering,

<div id="chart10"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_companies_median_salary.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* You might have noticed in <a href="#chart7">Chart-7</a> that a small orange bubble (Netflix) stands out distinctively from the crowd in terms of median wages. 
Here is another evidence in the above chart. You will see Netflix's median salary is always on the top of charts until 2017 later it dropped but not too much.
* Exxon Mobil also stayed ahead of its competitors in terms of median salaries.
* The big 5 tech which includes Amazon, Google, Facebook, Apple and Microsoft have consistently maintained top median salaries over these years. In 2018, all of them 
have over $130K. 
* Most other tech companies also have kept up their median salary above $100K over these years except for few exceptions regarding Uber and Tesla between years 2012-2014
* In financial companies, Wells Fargo has a median of $150K in 2018 while all other companies in this sector are barely around the median of $110K.
* All the oil sector companies have a median of over $120K in 2018 with Exxon Mobil leading the charts with $162K median salary in 2018.
* Most consulting firms have a median salaries way below than other sectors all over these years. In 2018, all of these have a median salaries 
between $80K-$90K.

### Degree of Income Inequality in Wages of Selected Employers
In <a href="#chart6">Chart-6</a>, we have seen how income inequality changed in few cities over years, now in this section we plot another figure <a href="#chart11">Chart-11</a> 
the income inequality but this time for selected employers.

<div id="chart11"></div>
<div class="responsive-wrap">
  <iframe src="/assets/custom/h1b_data_analysis/oflc_selected_companies_gini.html" frameborder="0" width="3000" height="500" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
</div>

Few observations from the above chart:
* Overall you will observe that there is a high degree of inequality in most employers prior to 2014. 
After that gini dropped in most employers which indicates that pay scales have become pretty much equivalent with not much variations.
* Wells Fargo in 2011 (gini=0.96) and AT&T in 2013 (gini=0.94) had a very high degree of income inequality which dropped in the later years.
* Since 2015, income inequality in most companies is at record low. 

## Disclaimer & Code
Please note that the results published in this case study are solely based on my data analysis and the code I wrote. 
I would strongly recommend you to use this analysis for educational purposes only but do not use this to base any of your decisions or 
make any conclusions. Please validate from your sources when possible. If you find any error in the analysis, please feel free to bring it to my notice. Also, please feel free to express any concerns or 
send in any questions or comments. 

All the code used in this analysis can be downloaded from this [github repository](https://github.com/genielab/h1b_data_analysis){:target="_blank"}
<br/>

### What Next?
Proceed to [Part-2: Cost of Living, Inflation and House Affordability Analysis]({% post_url 2019-04-04-h1b_data_analysis_part2 %})
<br/>
