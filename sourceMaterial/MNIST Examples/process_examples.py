#!/usr/bin/env python3

import os, sys, json, gzip, zlib

digits_dir = './phase1/digits-test/'
output_dir = './phase1/output/output-test-compressed/'
img_size = 28 * 28

# def process_file(dir, filename):
# 	filepath = os.path.join(dir, filename)
# 	raw_data = {}
# 	with open(filepath) as data:
# 		raw_data = json.load(data)['data']

# 	imgs = []
# 	start = 0
# 	while(start < len(raw_data)):
# 		imgs.append(raw_data[start : start + img_size])
# 		start += img_size

# 	print('Created %d image entries' % len(imgs))
# 	assert len(raw_data) - start == 0, 'Pixel entries should have evenly divided into img_size images with no leftovers.'

# 	os.makedirs(os.path.dirname(output_dir), exist_ok=True)

# 	json_data = json.dumps(imgs)
# 	# encoded = json_data.encode('utf-8')
# 	# compressed = gzip.compress(json_data)
# 	# with gzip.open(os.path.join(output_dir, filename + '.gz'), 'wb') as f:
# 	# 	f.write(json_data.encode("utf-8"))

# 	output = open(os.path.join(output_dir, filename), 'w')
# 	output.write(json_data)

def process_file(dir, filename):
	filepath = os.path.join(dir, filename)
	raw_data = {}
	with open(filepath) as data:
		raw_data = json.load(data)['data']

	imgs = []
	start = 0
	while(start < len(raw_data)):
		index = 0
		single_img = raw_data[start : start + img_size]
		out = {}
		while (index < len(single_img)):
			if (single_img[index] != 0):
				out[index] = single_img[index]
			index += 1
		imgs.append(out)
		start += img_size

	print('Created %d image entries' % len(imgs))
	assert len(raw_data) - start == 0, 'Pixel entries should have evenly divided into img_size images with no leftovers.'

	os.makedirs(os.path.dirname(output_dir), exist_ok=True)

	json_data = json.dumps({'imgs': imgs})
	encoded = json_data.encode('utf-8')
	# compressed_data = zlib.compress(encoded, 6)

	compressed = gzip.compress(encoded)
	with gzip.open(os.path.join(output_dir, filename + '.gz'), 'wb') as f:
		f.write(json_data.encode("utf-8"))



# ------------------------------------------------------------
def main():
	print('Loading Digits...')
	for filename in os.listdir(digits_dir):
		print('Processing ' + filename)
		process_file(digits_dir, filename)
		break
	
main()