# Binary to ASCII converter

## Test commands

| Command (first `cd build/`)                                                 |
| --------------------------------------------------------------------------- |
| ./binarytoascii -i ../data/data_byte.bin                                    |
| cat ../data/data_byte.bin \| ./binarytoascii                                |
| ./binarytoascii -i ../data/data_byte.bin -o ../write.txt                    |
| ./binarytoascii <../data/data_byte.bin                                      |
| ./binarytoascii -i ../data/data_byte.bin -o ../data/data_ascii.txt          |
| ./binarytoascii -I 5 -O 6 5<../data/data_int.bin 6>../data/data_ascii_1.txt |
| ./binarytoascii -o ../data/data_ascii_2.txt <../data/data_byte.bin          |
