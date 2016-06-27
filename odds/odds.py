#!/usr/bin/python

import math, json

def getTotalCombinations(n, k):
	# n: total elements, k: elements to combine
	# formula is (n! / (k!).(n-k)!)
	n_fact = math.factorial(n)
	k_fact = math.factorial(k)
	difference_factorial = math.factorial(n - k)
	denominator = k_fact * difference_factorial
	return n_fact / denominator

# program to calculate odds of getting dice rolls
def buildOddsForTwo(dice_total, total_hits):
	# the odds of one dice being one of the values - 1 or x - is 0.333
	# if we want to find the probability of a dice out of b dice being of our value, 
	# we multiply the odds.
	# so imagine we have 5 dice and want to see the chance of 2 of them being 1 or x
	# (1/3) * (1/3) * (2/3) * (2/3) * (2/3)
	# but there are lots of combinations, so we multiply these odds by the number of combinations
	# so let's multiply out the ones we want:

	# to help with the computation, we'll try and stay with integers for a while
	# so to start, let's break that up into (1/3)**n - here's the denominator
	odds_of_hits_denomintor = 3**total_hits
	total_miss = dice_total - total_hits
	# then the (2/3)**(k-n) part, for which we need the numerator and denominator
	odds_of_miss_numerator = 2**total_miss
	odds_of_miss_denominator = 3**total_miss
	# then we need the multiply by the total possible combinations
	combos = getTotalCombinations(dice_total, total_hits)
	# finally, turn that into a float
	return float(odds_of_miss_numerator * combos) / (odds_of_miss_denominator * odds_of_hits_denomintor)

def buildOddsForOne(dice_total, total_hits):
	# really almost the same as the above similarly named routine
	odds_of_hits_denomintor = 6**total_hits
	total_miss = dice_total - total_hits
	odds_of_miss_numerator = 5**total_miss
	odds_of_miss_denomintor = 6**total_miss
	combos = getTotalCombinations(dice_total, total_hits)
	return float(odds_of_miss_numerator * combos) / (odds_of_miss_denomintor * odds_of_hits_denomintor)

def exportAsJavascript(ones, twos, max_dice):
	# we need to make this into a javascript file called odds.js
	datafile = open('odds.js', 'w')
	datafile.write('"use strict";\n\n')
	datafile.write('// Odds of throwing this number of dice\n\n')
	datafile.write("var ODDS = {{'MAX_DICE': {0},\n".format(max_dice))
	datafile.write("            'ones':[")
	for i in ones:
		# it's a list, do convert the list to json
		array_data = json.dumps(i)
		datafile.write('{0},\n                    '.format(array_data))
	datafile.write('],\n')
	datafile.write("            'twos':[")
	for i in twos:
		# it's a list, do convert the list to json
		array_data = json.dumps(i)
		datafile.write('{0},\n                    '.format(array_data))
	datafile.write('],\n')
	datafile.write('            };\n')
	datafile.close()

if __name__ == '__main__':
	# Assuming 15 dice, we need to find the chances of getting 1..2 etc of the those dice
	MAX_DICE = 20
	# we need to build a table for MAX_DICE down to one
	ones = []
	twos = []
	for i in range(MAX_DICE):
		ones.append([buildOddsForOne(i + 1, x) for x in range(i + 2)])
		twos.append([buildOddsForTwo(i + 1, x) for x in range(i + 2)])
	exportAsJavascript(ones, twos, MAX_DICE)
	print '  Exported as odds.js in current directory.'
