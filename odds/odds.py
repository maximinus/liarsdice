#!/usr/bin/python

import math

def getTotalCombinations(n, k):
	# n: total elements, k: elements to combine
	# formula is (n! / (k!).(n-k)!)
	n_fact = math.factorial(n)
	k_fact = math.factorial(k)
	difference_factorial = math.factorial(n - k)
	denominator = k_fact * difference_factorial
	return n_fact / denominator

# program to calculate odds of getting dice rolls
def buildOdds(dice_total, total_hits):
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

if __name__ == '__main__':
	# Assuming 15 dice, we need to find the chances of getting 1..2 etc of the those dice
	TOTAL_DICE = 15
	print 'For {0} dice:'.format(TOTAL_DICE)

	odds = [buildOdds(TOTAL_DICE, x) for x in range(TOTAL_DICE + 1)]

	for i in range(TOTAL_DICE + 1):
		total_chance = sum(odds[:i+1]) * 100
		print '\t{0} hits: {1}%'.format(i, odds[i] * 100)
		print '\t\ttotal: {0}'.format(total_chance)
