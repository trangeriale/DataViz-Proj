import pandas as pd
import os

test_clean = pd.read_csv("user_cpu_gpu.csv")

#print(test_clean.head())

#print(len(test_clean.index))

pd.DataFrame.drop(test_clean, axis=1, labels="Index")

test_clean.to_csv('final.csv', mode= 'w', header = True, index_label = "Index")

#print(test_clean["Index"][0:15])