from ubm_scrape import *
from ubm_scrape import driver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException

import pandas as pd 
import os

part_buttons = driver.find_elements_by_class_name("nodec")
action = ActionChains(driver)

for i in range(len(part_buttons)):
	if part_buttons[i].text == "CPU":
		cpu_button = part_buttons[i]

#choose CPU tab

#prepare dataset to rolllll
UserID = list()
game_rating = list()
desktop_rating = list()
work_rating = list()
CPU = list()
CPU_rating = list()
GPU = list()
GPU_rating = list()
SSD = list()
RAM = list()
MBD = list()

user_count = 0

#logic: click on each user
#rmb to add longer range
for i in range(100):
	driver.get("https://cpu.userbenchmark.com/Software")
	driver.implicitly_wait(120000)
	driver.refresh()
	driver.implicitly_wait(120000)
	
	driver.find_element_by_class_name('bglink').click()

	driver.implicitly_wait(360000)
	driver.implicitly_wait(120000)
	#start getting the data
	copy_button = WebDriverWait(driver, 100).until(EC.presence_of_element_located((By.CLASS_NAME, "fa-copy")))
	#filtered_list = [i for (i, v) in zip(list_a, filter) if v]

	driver.find_element_by_class_name("fa-copy").click()
	driver.implicitly_wait(100000)

	#user computer info
	user_comp_info = driver.find_element_by_id("modalTextArea").text.split('\n')

	#in the case of missing data, skip this instance
	if(len(user_comp_info) < 6):
		continue

	#user_ID
	user_ID_and_rating = user_comp_info[0].split(' ')
	#print(user_ID_and_rating)
	#there is missing data for ratings
	if(user_ID_and_rating[1]=='[/url]'):
		print("f this")
		driver.back()
		continue



	prefix_ID = '[url=https://www.userbenchmark.com/UserRun/'
	suffix_ID = ']UserBenchmarks:'
	
	user_ID = user_ID_and_rating[0][(len(prefix_ID)):(0-len(suffix_ID))]
	
	UserID.append(user_ID)
	print(user_ID)

	user_game_rating = user_ID_and_rating[2][:-1]
	print(user_game_rating)
	game_rating.append(user_game_rating)

	user_desktop_rating = user_ID_and_rating[4][:-1]
	print(user_desktop_rating)
	desktop_rating.append(user_desktop_rating)

	user_work_rating = user_ID_and_rating[6][:-6]
	print(user_work_rating)
	work_rating.append(user_work_rating)

	#user CPU
	user_CPU_string = user_comp_info[1]
	user_CPU = user_CPU_string[(user_CPU_string.find("]")+1):(user_CPU_string.find("[/url]"))]
	user_CPU_rating = user_CPU_string[(user_CPU_string.find("[b]") + 3):(user_CPU_string.find("[/b]"))]

	print(user_CPU)
	print(user_CPU_rating)

	CPU.append(user_CPU)
	CPU_rating.append(user_CPU_rating)

	#user GPU
	user_GPU_string = user_comp_info[2]
	user_GPU = user_GPU_string[(user_GPU_string.find("]")+1):(user_GPU_string.find("[/url]"))]
	user_GPU_rating = user_GPU_string[(user_GPU_string.find("[b]") + 3):(user_GPU_string.find("[/b]"))]
	
	print(user_GPU)
	print(user_GPU_rating)

	GPU.append(user_GPU)
	GPU_rating.append(user_GPU_rating)

	#for debugging/tabulating
	user_count += 1
	print("User count is: %d" % user_count)
	driver.implicitly_wait(12000)
	driver.implicitly_wait(12000)
	#driver.refresh()
	#driver.implicitly_wait(3000)

#even if didn't finish loop that's fine

user_comp_data = {'UserID' : UserID, 'gameRating' : game_rating, 'desktopRating' : desktop_rating , 'workRating' : work_rating, 'CPU' : CPU, 'CPURating': CPU_rating, 'GPU' : GPU, 'GPURating' : GPU_rating}
comp_dataset = pd.DataFrame(user_comp_data)

comp_dataset = pd.DataFrame.drop_duplicates(comp_dataset, subset=["UserID"])

print(comp_dataset)
comp_dataset.to_csv('user_cpu_gpu.csv', mode= 'a', header = False)



