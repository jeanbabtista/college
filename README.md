# Binary to ASCII converter

## Standard output

- ./binarytoascii -i ../data/data_byte.bin

input: 'data_byte.bin', output: fd = 1

- cat ../data/data_byte.bin | ./binarytoascii

input: 'data_byte.bin', output: fd = 1

## Custom output

- ./binarytoascii -i ../data/data_byte.bin -o ../write.txt

input: 'data_byte.bin', output: fd = open(write.txt)
