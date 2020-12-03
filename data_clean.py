import pandas as pd
import os

test_clean = pd.read_csv("user_cpu_gpu.csv")

#print(test_clean.head())

#print(len(test_clean.index))
test_clean = pd.DataFrame.drop_duplicates(test_clean, subset=["UserID"])

test_clean.to_csv('final.csv', mode= 'w', header = True, index_label = "Index")

#print(test_clean["Index"][0:15])