# Binary to ASCII converter

| Command                                                  | Input           | Output                 |
| -------------------------------------------------------- | --------------- | ---------------------- |
| ./binarytoascii -i ../data/data_byte.bin                 | 'data_byte.bin' | fd = 1                 |
| cat ../data/data_byte.bin \| ./binarytoascii             | 'data_byte.bin' | fd = 1                 |
| ./binarytoascii -i ../data/data_byte.bin -o ../write.txt | 'data_byte.bin' | fd = open('write.txt') |
