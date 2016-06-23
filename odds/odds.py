#!/usr/bin/python

# program to calculate odds of getting dice rolls

TOP_DICE = 3

def buildOdds(dice_total):
	dice = [1] * dice_total
	index = 0
	results = []
	while(True):
		results.append(dice[:])
		for i in range(dice_total):
			# keep moving up until we have a result
			dice[i] += 1
			if dice[i] <= TOP_DICE:
				# we are done
				break
			else:
				# reset this dice
				dice[i] = 1
			# the loop will automatically move on to the next number
		# when the loop breaks, we need to check if a 6 exists
		if dice.count(3) == dice_total:
			results.append(dice[:])
			return(results)

def countTotal(dice):
	pass

if __name__ == '__main__':
	print buildOdds(3)
