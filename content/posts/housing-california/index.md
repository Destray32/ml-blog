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

![houses-visualisation](https://imgur.com/QCZ90M7.png)

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

We can try to plot the scatter matrix to see the correlation between the features.

![scatter-matrix](https://i.imgur.com/IUxKChE.png)

From there we can clearly see that the `median_income` has the most linear correlation with the `median_house_value`. So we plot the scatter plot median_income against median_house_value.

![median income agains value](https://i.imgur.com/bJNGYH7.png)

The interesting thing with this plot is that we can clearly see some horizontal lines at 500,000, 450,000, 350,000 and 280,000. This means that the data is capped at these values. We can try to remove these data points from the dataset to avoid the model to learn from these data points. 

## Feature Engineering

### Handling text/categorical attributes

Our dataset contains one categorical attribute `ocean_proximity`. We can convert these text labels to numbers using the `OneHotEncoder` class from Scikit-Learn. 

```python
from sklearn.preprocessing import OrdinalEncoder

housing_cat = housing[["ocean_proximity"]]

ordinal_encoder = OrdinalEncoder()
housing_cat_encoded = ordinal_encoder.fit_transform(housing_cat)
```

This will convert the text labels to numbers. 

### Feature Scaling and custom transformers


This step is very important in this small project because the features have different scales. Most of the times machine learning algorithms tend to perform better when the features are scaled. Without scaling models will be biased towards the features with the larger scales. 

For this task we will create our own transformer to scale the features. 

```python
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.utils.validation import check_array, check_is_fitted

class StandardScalerClone(BaseEstimator, TransformerMixin):
    def __init__(self, with_mean=True):  # no *args or **kwargs!
        self.with_mean = with_mean

    def fit(self, X, y=None):  # y is required even though we don't use it
        X = check_array(X)  # checks that X is an array with finite float values
        self.mean_ = X.mean(axis=0)
        self.scale_ = X.std(axis=0)
        self.n_features_in_ = X.shape[1]  # allows us to check that X has the same number of features during transform
        return self  # always return self!

    def transform(self, X):
        check_is_fitted(self)  # looks for learned attributes (with trailing _)
        X = check_array(X)
        assert self.n_features_in_ == X.shape[1]
        if self.with_mean:
            X = X - self.mean_
        return X / self.scale_
```

And then we will create a transformer for finding clusters in the data. 

```python
from sklearn.cluster import KMeans

class ClusterSimilarity(BaseEstimator, TransformerMixin):
    def __init__(self, n_clusters=10, gamma=1.0, random_state=None):
        self.n_clusters = n_clusters
        self.gamma = gamma
        self.random_state = random_state

    def fit(self, X, y=None, sample_weight=None): 
        self.kmeans_ = KMeans(self.n_clusters, n_init=10,
                              random_state=self.random_state)
        self.kmeans_.fit(X, sample_weight=sample_weight)
        return self  # always return self!

    def transform(self, X):
        return rbf_kernel(X, self.kmeans_.cluster_centers_, gamma=self.gamma)

    def get_feature_names_out(self, names=None):
        return [f"Cluster {i} similarity" for i in range(self.n_clusters)]
```

Later we will use these transformers in the pipeline for the model. 

We can check how our cluster transformer works by plotting the clusters on the map. But first we will need to fit transformer to the data. 

```python
cluster_simil = ClusterSimilarity(n_clusters=10, gamma=1., random_state=42)
similarities = cluster_simil.fit_transform(housing[["latitude", "longitude"]],
                                           sample_weight=housing_labels)
```

After plotting the clusters on the map we can see that it did a good job at finding most concentrated areas.

![clusters](https://i.imgur.com/ifx2pvw.png)

With custom transformers we can now build the pipeline for doing all the work for our data preparation.
    
```python
def column_ratio(X):
return X[:, [0]] / X[:, [1]]

def ratio_name(function_transformer, feature_names_in):
    return ["ratio"]  # feature names out

def ratio_pipeline():
    return make_pipeline(
        SimpleImputer(strategy="median"),
        FunctionTransformer(column_ratio, feature_names_out=ratio_name),
        StandardScaler())

log_pipeline = make_pipeline(
    SimpleImputer(strategy="median"),
    FunctionTransformer(np.log, feature_names_out="one-to-one"),
    StandardScaler())
cluster_simil = ClusterSimilarity(n_clusters=10, gamma=1., random_state=42)
default_num_pipeline = make_pipeline(SimpleImputer(strategy="median"),
                                     StandardScaler())
preprocessing = ColumnTransformer([
        ("bedrooms", ratio_pipeline(), ["total_bedrooms", "total_rooms"]),
        ("rooms_per_house", ratio_pipeline(), ["total_rooms", "households"]),
        ("people_per_house", ratio_pipeline(), ["population", "households"]),
        ("log", log_pipeline, ["total_bedrooms", "total_rooms", "population",
                               "households", "median_income"]),
        ("geo", cluster_simil, ["latitude", "longitude"]),
        ("cat", cat_pipeline, make_column_selector(dtype_include=object)),
    ],
    remainder=default_num_pipeline)  # one column remaining: housing_median_age
```

The following code defines three functions, first function `column_ratio` calculates the ratio of two columns. The second function `ratio_name` returns the name of the new feature. The third function `ratio_pipeline` returns the pipeline for the ratio feature. 

Then we define the `log_pipeline` which calculates the logarithm of the features. Next thing is to define the `cluster_simil` which is the pipeline for the cluster transformer and the last one `default_num_pipeline` which is the default pipeline for the numerical features. 

The last step is to define the `preprocessing` pipeline which will use all the defined pipelines for the data preparation. 


## Model selection and training


After exploring the data and preparing features we can now start with selecting good model for the task. We have tried the following models:
1. Linear Regression
2. Decision Tree Regressor

### Linear Regression
With our data prepeared with preprocessing pipeline we can now train the linear regression model. 

```python
from sklearn.linear_model import LinearRegression

lin_reg = make_pipeline(preprocessing, LinearRegression())
lin_reg.fit(housing, housing_labels)
```

After training the model and comparing the predictions with the actual values we can see that the model is not very good with predicting correct values. 

```python
housing_predictions = lin_reg.predict(housing)
housing_predictions[:5].round(-2)  # -2 = rounded to the nearest hundred
>>> array([242800., 375900., 127500.,  99400., 324600.])

housing_labels.iloc[:5].values
>>> array([458300., 483800., 101700.,  96100., 361800.])
```

We can see that after calculating the mean squared error the error is 68647 which is not very good for the model. 
```python
from sklearn.metrics import mean_squared_error

lin_rmse = mean_squared_error(housing_labels, housing_predictions,
                              squared=False)
lin_rmse
>>> 68647.95686706669
```

### Decision Tree Regressor
So the next thing we can try is to train the model using more advanced model like Decision Tree Regressor. Let's see how it performs. 

```python
from sklearn.tree import DecisionTreeRegressor

tree_reg = make_pipeline(preprocessing, DecisionTreeRegressor(random_state=42))
tree_reg.fit(housing, housing_labels)

housing_predictions = tree_reg.predict(housing)
tree_rmse = mean_squared_error(housing_labels, housing_predictions,
                              squared=False)
tree_rmse

>>> 0.0
```

We can see that the Decision Tree Regressor has a RMSE of 0.0 which is very good on paper. But this is not a good sign because it means that the model has overfitted the data very strongly. 





[^1]: https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/
[^2]: https://github.com/ageron/handson-ml3
[^3]: "Sparse Spatial Autoregressions” by Pace, R. Kelley and Ronald Barry, 1997






