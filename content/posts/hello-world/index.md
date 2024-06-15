---
title: "Housing prices prediction"
date: "2024-06-14"
---

## Introduction

Lately I had a great opportunity to read the book _"Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow"_ by Aurélien Géron[^1]. The book is a great resource for learning machine learning and deep learning. 

One of the projects in the book is to predict the housing prices using the California housing dataset. I decided to implement the project in Python and see what I can learn from it. 

Code examples for this project can be found in the GitHub Repository[^2] of the author.


## Dataset description

The dataset of housing prices using the California housing dataset from StatLib repository[^3] with data that was based on data from the 1990 California census. The dataset has 20,640 observations on housing prices, which is not a big dataset but it is a good enough to learn from. 

The dataset has the following features:

1. `longitude`: A measure of how far west a house is; a higher value is farther west
2. `latitude`: A measure of how far north a house is; a higher value is farther north
3. `housing_median_age`: Median age of a house within a block; a lower number is a newer building
4. `total_rooms`: Total number of rooms within a block
5. `total_bedrooms`: Total number of bedrooms within a block
6. `population`: Total number of people residing within a block
7. `households`: Total number of households, a group of people residing within a home unit, for a block
8. `median_income`: Median income for households within a block of houses
9. `median_house_value`: Median house value for households within a block


## Exploratory Data Analysis
We will start by loading the dataset and exploring date to get a better understanding of it. My favourite step is to plot the data using real california map to see the distribution of houses. This will help us to understand the data better. 

We can see that this chart shows the median house value in blue to red color scale. If it is blue then the house median value is low and red if it is otherwise. 

![S](https://imgur.com/QCZ90M7.png)

### Looking for correlations

Out data is not very large so we can easily calculate the standard correlation coefficient (Pearson's r) between every pair of attributes using the `corr()` method. 

```python
corr_matrix = housing.corr()
corr_matrix["median_house_value"].sort_values(ascending=False)
```

This will give us the following correlation matrix:


```
median_house_value    1.000000
median_income         0.688380
total_rooms           0.137455
housing_median_age    0.102175
households            0.071426
total_bedrooms        0.054635
population           -0.020153
longitude            -0.050859
latitude             -0.139584
Name: median_house_value, dtype: float64
```

As we can see the `median_income` has the highest correlation with the `median_house_value` which is 0.688380 and the latitude has the lowest correlation with the `median_house_value` which is -0.139584. This means that `median_income` will propably be the most important feature for predicting the `median_house_value`.




[^1]: https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/
[^2]: https://github.com/ageron/handson-ml3
[^3]: "Sparse Spatial Autoregressions” by Pace, R. Kelley and Ronald Barry, 1997






